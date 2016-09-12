'use strict'

angular.module('mean.ffxivCrafter').factory('projectAnalyzerService', function () {
  function getAmountOfItemInUnnallocatedStock (projectData, itemId) {
    for (var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i]

      if (sItem.item._id === itemId) {
        return sItem.amount
      }
    }

    return null
  }

  function itemInUnallocatedStock (projectData, itemId, amount) {
    var storedAmount = getAmountOfItemInUnnallocatedStock(projectData, itemId, amount)

    return storedAmount != null && storedAmount >= amount
  }

  function deductFromUnallocatedStock (projectData, itemId, amount) {
    for (var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i]

      if (sItem.item._id === itemId) {
        sItem.amount -= amount
      }
    }
  }

  function gatheringStep (step, projectData) {
    if (!projectData.gatherList[step.item._id]) {
      projectData.gatherList[step.item._id] = {
        item: step.item,
        outstanding: 0
      }
    }

    projectData.gatherList[step.item._id].outstanding += step.amount
  }

  function buyingStep (step, projectData) {
    if (!projectData.gatherList[step.item._id]) {
      projectData.gatherList[step.item._id] = {
        item: step.item,
        outstanding: 0
      }
    }

    projectData.gatherList[step.item._id].outstanding += step.amount
    projectData.totalCost += step.item.price * step.amount
  }

  function craftingStep (step, projectData) {
    var neededAmount = step.amount - getAmountOfItemInUnnallocatedStock(projectData, step.item._id)

    if (neededAmount > 0) {
      var neededSteps = Math.ceil(neededAmount / step.recipe.outputs[0].amount) // how often we need to craft the recipe to fulfill the need
      var maxSteps = neededSteps // how often we can craft the recipe, with our input materials

      var neededInputs = {}

      step.recipe.inputs.forEach(function (input, index) {
        var neededItems = input.amount * neededSteps

        var itemsInStock = getAmountOfItemInUnnallocatedStock(projectData, input.item)
        var remainingNeeded = neededItems - itemsInStock

        neededInputs[input.item] = remainingNeeded
        var possibleSteps = itemsInStock > 0 ? itemsInStock / input.amount : 0

        maxSteps = Math.min(maxSteps, possibleSteps)
      })

      if (maxSteps > 0) {
        projectData.craftableSteps.push({
          step: {
            amount: maxSteps * step.recipe.outputs[0].amount,
            item: step.item,
            recipe: step.recipe
          }
        })

        step.recipe.inputs.forEach(function (input, index) {
          deductFromUnallocatedStock(projectData, input.item._id, input.amount * maxSteps)
        })
      }

      step.inputs.forEach(function (input, index) {
        input.amount = neededInputs[input.item._id]
        analyzeStep(input, projectData)
      })
    } else {
      deductFromUnallocatedStock(projectData, step.item._id, step.amount)
    }
  }

  function analyzeStep (step, projectData) {
    if (step.step === 'Gather') {
      gatheringStep(step, projectData)
    } else if (step.step === 'Craft') {
      craftingStep(step, projectData)
    } else if (step.step === 'Buy') {
      buyingStep(step, projectData)
    }
  }

  function updateMaterialList (projectList, projectData) {
    projectList.forEach(function (project) {
      if (!projectData[project._id]) {
        projectData[project._id] = {
          project: project,
          gatherList: {},
          craftableSteps: [],
          unallocatedStock: $.extend(true, {}, project.stock),
          totalCost: 0
        }
      }

      analyzeStep($.extend(true, {}, project.tree), projectData[project._id])
    })
  }

  return {
    analyzeStep: analyzeStep,
    updateMaterialList: updateMaterialList
  }
})
