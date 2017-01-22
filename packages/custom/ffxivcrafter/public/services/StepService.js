'use strict'

angular.module('mean.ffxivCrafter').factory('StepService', [ 'MeanUser',
  function (MeanUser) {
    return {
      canHarvest: function (step) {
        var map = [['Miner', 'minerLevel'], ['Botanist', 'botanistLevel']]

        for (var i in map) {
          var job = map[i]
          if (step.item.gatheringJob === 'None') {
            return true
          } else if (step.item.gatheringJob === job[0]) {
            return step.item.gatheringLevel <= MeanUser.user[job[1]]
          }
        }

        return false
      },

      canCraft: function (step) {
        var map = [
        ['Weaver', 'weaverLevel'],
        ['Culinarian', 'culinarianLevel'],
        ['Alchemist', 'alchimistLevel'],
        ['Blacksmith', 'blacksmithLevel'],
        ['Carpenter', 'carpenterLevel'],
        ['Armorer', 'armorerLevel'],
        ['Goldsmith', 'goldsmithLevel'],
        ['Leatherworker', 'leatherworkerLevel']
        ]

        for (var i in map) {
          var job = map[i]

          if (step.step.recipe.craftingJob === job[0]) {
            return step.step.recipe.craftingLevel <= MeanUser.user[job[1]]
          }
        }

        return false
      }
    }
  }
])
