'use strict'

angular.module('mean.ffxivCrafter').directive('projectStep', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/projectStep.html',
    scope: {
      step: '=',
      updateStep: '&'
    },
    controller: function ($scope) {
      $scope.update = function () {
        $scope.updateStep()($scope.step)
      }

      $scope.outputStepPrice = function (step) {
        return step.amount * step.item.price
      }

      $scope.inputPriceSum = function (step) {
        var sum = 0

        step.inputs.forEach(function (input) {
          sum += input.item.price * input.amount
        })

        return sum
      }

      $scope.isCheaperToBuy = function (step) {
        return $scope.inputPriceSum(step) > $scope.outputStepPrice(step)
      }

      $scope.suggestionClass = function (step) {
        if (step.inputs.length == 0) return 'noSuggestion'

        if ($scope.isCheaperToBuy(step)) return 'buyItem'
        return 'craftItem'
      }
    }
  }
})
