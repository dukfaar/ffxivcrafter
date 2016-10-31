'use strict'

angular.module('mean.ffxivCrafter').factory('projectAnalyzerService', function ($q) {
  function getAmountOfItemInUnnallocatedStock (projectData, itemId, hq) {
    for (var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i]

      if (sItem.item._id === itemId && sItem.hq === hq) {
        return sItem.amount
      }
    }

    return null
  }

  function markStockAsRequiredBy (projectData, itemId, hq, requiredByStep) {
    if (!projectData.stockRequirements[itemId + '_' + hq]) projectData.stockRequirements[itemId + '_' + hq] = []
    projectData.stockRequirements[itemId + '_' + hq].push(requiredByStep)
  }

  function itemInUnallocatedStock (projectData, itemId, amount, hq) {
    var storedAmount = getAmountOfItemInUnnallocatedStock(projectData, itemId, amount, hq)

    return storedAmount != null && storedAmount >= amount
  }

  function deductFromUnallocatedStock (projectData, itemId, amount, hq) {
    for (var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i]

      if (sItem.item._id === itemId && sItem.hq === hq) {
        sItem.amount -= amount
      }
    }
  }

  function stepLookup (step) {
    return step.item._id + (step.hq ? 'HQ' : 'NQ')
  }

  function checkForGatheringStepObject (step, projectData) {
    var lookup = stepLookup(step)

    if (!projectData.gatherList[lookup]) {
      projectData.gatherList[lookup] = {
        item: step.item,
        outstanding: 0,
        hq: step.hq ? true : false
      }
    }

    return projectData.gatherList[lookup]
  }

  function gatheringStep (step, projectData) {
    var deferred = $q.defer()

    checkForGatheringStepObject(step, projectData).outstanding += step.amount

    deferred.resolve()
    return deferred.promise
  }

  function itemPrice (step) {
    if (!step.item) return 0
    return step.step !== 'Meta' ? (step.hq ? step.item.priceHQ : step.item.price) : 0
  }

  function stepPrice (step) {
    if (step.step === 'Meta') {
      var sum = 0
      step.inputs.forEach(function (input) {
        sum += stepPrice(input)
      })
      return sum
    } else {
      return itemPrice(step) * step.amount
    }
  }

  function checkForBuyingStepObject (step, projectData) {
    var lookup = stepLookup(step)

    if (!projectData.buyList[lookup]) {
      projectData.buyList[lookup] = {
        item: step.item,
        outstanding: 0,
        hq: step.hq ? true : false
      }
    }

    return projectData.buyList[lookup]
  }

  function buyingStep (step, projectData) {
    var deferred = $q.defer()

    checkForGatheringStepObject(step, projectData).outstanding += step.amount
    checkForBuyingStepObject(step, projectData).outstanding += step.amount

    projectData.totalCost += stepPrice(step)

    deferred.resolve()
    return deferred.promise
  }

  function findInputByItem (inputs, itemId) {
    var result = null

    inputs.forEach(function (input) {
      if(input.item._id === itemId) result = input
    })

    return result
  }

  function getMaxCraftableSteps (step, projectData) {
    var result = {}

    result.neededAmount = step.amount - getAmountOfItemInUnnallocatedStock(projectData, step.item._id, step.hq)

    result.neededSteps = Math.ceil(result.neededAmount / step.recipe.outputs[0].amount) // how often we need to craft the recipe to fulfill the need
    result.maxSteps = result.neededSteps // how often we can craft the recipe, with our input materials

    result.neededInputs = {}

    step.recipe.inputs.forEach(function (input) {
      var neededItems = input.amount * result.neededSteps

      var itemsInStock = getAmountOfItemInUnnallocatedStock(projectData, input.item, findInputByItem(step.inputs, input.item).hq) // 50
      var remainingNeeded = Math.max(0, neededItems - itemsInStock)

      result.neededInputs[input.item] = remainingNeeded

      var possibleSteps = itemsInStock > 0 ? itemsInStock / input.amount : 0

      result.maxSteps = Math.min(result.maxSteps, possibleSteps)
    })

    return result
  }

  function craftingStep (step, projectData) {
    var deferred = $q.defer()

    var stepData = getMaxCraftableSteps(step, projectData)

    if (stepData.neededAmount > 0) {
      // we need to craft

      if (stepData.maxSteps > 0) {
        // and we can craft at least a few things

        // create a crafting step
        projectData.craftableSteps.push({
          step: {
            amount: stepData.maxSteps * step.recipe.outputs[0].amount,
            item: step.item,
            recipe: step.recipe,
            inputs: $.extend(true, {}, step.inputs),
            hq: step.hq
          }
        })

        // and remove every item that would be used in this crafting steps
        step.recipe.inputs.forEach(function (input) {
          var stepInput = findInputByItem(step.inputs, input.item)
          markStockAsRequiredBy(projectData, input.item, stepInput.hq, step)
          deductFromUnallocatedStock(projectData, input.item, input.amount * stepData.maxSteps, stepInput.hq)
        })
      } else {
        // we still need to allocate any items that COULD be used
        step.inputs.forEach(function (input) {
          markStockAsRequiredBy(projectData, input.item._id, input.hq, step)
          var itemsInStock = getAmountOfItemInUnnallocatedStock(projectData, input.item._id, input.hq)
          var amount = Math.min(itemsInStock, input.amount)
          deductFromUnallocatedStock(projectData, input.item._id, amount, input.hq)
        })
      }


      $q.all(step.inputs.map(function(input) {
        input.amount = stepData.neededInputs[input.item._id]
        return analyzeStep(input, projectData)
      })).then(function() {
        deferred.resolve()
      })
    } else {
      /*
      no crafting needed
      deduce this steps items from the stock and be done
      */
      deductFromUnallocatedStock(projectData, step.item._id, step.amount, step.hq)

      deferred.resolve()
    }

    return deferred.promise
  }

  /**
    have a look at this, was the simple version enough?
  */
  function metaStep (step, projectData) {
    var deferred = $q.defer()

    $q.all(step.inputs.map(function(input) {
      if (input.step !== 'Meta') {
        var inStock = getAmountOfItemInUnnallocatedStock(projectData, input.item._id, input.hq)
        var takeFromStock = Math.min(inStock, input.amount)

        input.amount -= takeFromStock

        deductFromUnallocatedStock(projectData, input.item._id, takeFromStock, input.hq)
      }

       return analyzeStep(input, projectData)
    }))
    .then(function() {
      deferred.resolve()
    })

    return deferred.promise
  }

  function analyzeStep (step, projectData) {
    if (step.step === 'Gather') {
      return gatheringStep(step, projectData)
    } else if (step.step === 'Craft') {
      return craftingStep(step, projectData)
    } else if (step.step === 'Buy') {
      return buyingStep(step, projectData)
    } else if (step.step === 'Meta') {
      return metaStep(step, projectData)
    }
  }

  function getProjectMaterialList (project) {
    var deferred = $q.defer()

    var result = {
      project: project,
      stockRequirements: {},
      gatherList: {},
      buyList: {},
      craftableSteps: [],
      unallocatedStock: $.extend(true, {}, project.stock),
      totalCost: 0
    }

    deferred.notify(result)

    analyzeStep($.extend(true, {}, project.tree), result)
    .then(function() {
      result.revenue = stepPrice(project.tree)
      result.profit = stepPrice(project.tree) * 0.95 - result.totalCost
      result.relativeProfit = (result.profit / result.totalCost) * 100

      deferred.resolve(result)
    })

    return deferred.promise
  }

  function updateMaterialList (projectList, projectData) {
    projectList.forEach(function (project) {
      getProjectMaterialList(project)
      .then(function(data) {
        projectData[project._id] = data
      })
    })
  }

  return {
    analyzeStep: analyzeStep,
    getProjectMaterialList: getProjectMaterialList,
    updateMaterialList: updateMaterialList,
    itemPrice: itemPrice,
    stepPrice: stepPrice
  }
})
