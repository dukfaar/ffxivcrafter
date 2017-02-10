'use strict'

angular.module('mean.ffxivCrafter').factory('StepService', [ 'MeanUser',
  function (MeanUser) {
    return {
      canHarvest: function (step) {
        if (step.item.gatheringJob === 'None') {
          return true
        }

        var map = [['Miner', 'miner'], ['Botanist', 'botanist']]

        for (var i in map) {
          var job = map[i]
          if (step.item.gatheringJob === job[0]) {
            var hasFolklore = true
            if (step.item.unspoiledNodeTime && step.item.unspoiledNodeTime.folkloreNeeded && step.item.unspoiledNodeTime.folkloreNeeded.length > 0) {
              if (MeanUser.user[job[1] + 'Folklore']) {
                hasFolklore = MeanUser.user[job[1] + 'Folklore'][step.item.unspoiledNodeTime.folkloreNeeded] === true
              } else {
                hasFolklore = false
              }
            }
            return hasFolklore && step.item.gatheringLevel <= MeanUser.user[job[1] + 'Level']
          }
        }

        return false
      },

      canCraft: function (step) {
        var map = [
        ['Weaver', 'weaver'],
        ['Culinarian', 'culinarian'],
        ['Alchemist', 'alchimist'],
        ['Blacksmith', 'blacksmith'],
        ['Carpenter', 'carpenter'],
        ['Armorer', 'armorer'],
        ['Goldsmith', 'goldsmith'],
        ['Leatherworker', 'leatherworker']
        ]

        for (var i in map) {
          var job = map[i]

          if (step.step.recipe.craftingJob === job[0]) {
            var hasMaster = true
            if (step.step.recipe.masterbook > 0) {
              if (MeanUser.user[job[1] + 'Master']) {
                hasMaster = MeanUser.user[job[1] + 'Master'][(step.step.recipe.masterbook - 1)] === true
              } else {
                hasMaster = false
              }
            }
            return hasMaster && step.step.recipe.craftingLevel <= MeanUser.user[job[1] + 'Level']
          }
        }

        return false
      }
    }
  }
])
