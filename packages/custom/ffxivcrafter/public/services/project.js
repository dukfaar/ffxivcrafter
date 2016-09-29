'use strict'

angular.module('mean.ffxivCrafter').factory('projectAnalyzerService', function () {
  function getAmountOfItemInUnnallocatedStock (projectData, itemId, hq) {
    for (var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i]

      if (sItem.item._id === itemId && sItem.hq === hq) {
        return sItem.amount
      }
    }

    return null
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
    checkForGatheringStepObject(step, projectData).outstanding += step.amount
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

  function buyingStep (step, projectData) {
    checkForGatheringStepObject(step, projectData).outstanding += step.amount

    projectData.totalCost += stepPrice(step)
  }

  function getMaxCraftableSteps (step, projectData) {
    var result = {}

    result.neededAmount = step.amount - getAmountOfItemInUnnallocatedStock(projectData, step.item._id, step.hq)

    result.neededSteps = Math.ceil(result.neededAmount / step.recipe.outputs[0].amount) // how often we need to craft the recipe to fulfill the need
    result.maxSteps = result.neededSteps // how often we can craft the recipe, with our input materials

    result.neededInputs = {}

    step.recipe.inputs.forEach(function (input, index) {
      var neededItems = input.amount * result.neededSteps

      var itemsInStock = getAmountOfItemInUnnallocatedStock(projectData, input.item, step.inputs[index].hq) // 50
      var remainingNeeded = neededItems - itemsInStock

      result.neededInputs[input.item] = remainingNeeded
      var possibleSteps = itemsInStock > 0 ? itemsInStock / input.amount : 0

      result.maxSteps = Math.min(result.maxSteps, possibleSteps)
    })

    return result
  }

  // rewrite this thingy
  function craftingStep (step, projectData) {
    console.log('craft ' + step.item.name + ' start')

    var stepData = getMaxCraftableSteps(step, projectData)
    console.log('can craft a maximum of %i', stepData.maxSteps)

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
        step.recipe.inputs.forEach(function (input, index) {
          console.log('allocated %i %s', input.amount * stepData.maxSteps, input.item)
          deductFromUnallocatedStock(projectData, input.item, input.amount * stepData.maxSteps, step.inputs[index].hq)
        })
      } else {
        // we still need to allocate any items that COULD be used
        step.inputs.forEach(function (input, index) {
          var itemsInStock = getAmountOfItemInUnnallocatedStock(projectData, input.item._id, input.hq)
          var amount = Math.min(itemsInStock, input.amount)
          deductFromUnallocatedStock(projectData, input.item._id, amount, input.hq)
        })
      /*step.recipe.inputs.forEach(function (input, index) {
        console.log('allocated %i %s', input.amount * stepData.maxSteps, input.item)
        deductFromUnallocatedStock(projectData, input.item, input.amount * stepData.maxSteps, step.inputs[index].hq)
      })*/
      }

      step.inputs.forEach(function (input, index) {
        input.amount = stepData.neededInputs[input.item._id]
        console.log('input of %s set to %i', input.item.name, input.amount)
        analyzeStep(input, projectData)
      })
    } else {
      /*
      no crafting needed
      deduce this steps items from the stock and be done
      */
      console.log('deducing %i items', step.amount)
      deductFromUnallocatedStock(projectData, step.item._id, step.amount, step.hq)
    }
  }

  /**
    have a look at this, was the simple version enough?
  */
  function metaStep (step, projectData) {
    step.inputs.forEach(function (input, index) {
      if (input.step !== 'Meta') {
        var inStock = getAmountOfItemInUnnallocatedStock(projectData, input.item._id, input.hq)
        var takeFromStock = Math.min(inStock, input.amount)

        input.amount -= takeFromStock

        deductFromUnallocatedStock(projectData, input.item._id, takeFromStock, input.hq)
      }

      analyzeStep(input, projectData)
    })
  }

  function analyzeStep (step, projectData) {
    if (step.step === 'Gather') {
      gatheringStep(step, projectData)
    } else if (step.step === 'Craft') {
      craftingStep(step, projectData)
    } else if (step.step === 'Buy') {
      buyingStep(step, projectData)
    } else if (step.step === 'Meta') {
      metaStep(step, projectData)
    }
  }

  function getProjectMaterialList (project) {
    var result = {
      project: project,
      gatherList: {},
      craftableSteps: [],
      unallocatedStock: $.extend(true, {}, project.stock),
      totalCost: 0
    }

    analyzeStep($.extend(true, {}, project.tree), result)

    return result
  }

  function updateMaterialList (projectList, projectData) {
    projectList.forEach(function (project) {
      projectData[project._id] = getProjectMaterialList(project)
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
