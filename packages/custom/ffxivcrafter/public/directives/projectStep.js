'use strict'

angular.module('mean.ffxivCrafter').directive('projectStep', function ($mdDialog) {
  return {
    templateUrl: '/ffxivCrafter/views/project/projectStep.html',
    scope: {
      step: '=',
      updateStep: '&',
      priceUpdate: '&'
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
        if (step.inputs.length === 0) return 'noSuggestion'

        if ($scope.isCheaperToBuy(step)) return 'buyItem'
        return 'craftItem'
      }

      $scope.priceDialog = function (item) {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter/views/item/priceDialog.html',
          parent: angular.element(document.body),
          controller: 'ItemPriceDialogController',
          clickOutsideToClose: true,
          locals: {
            item: item,
            priceUpdate: $scope.priceUpdate
          }
        }).then(function () {
        })
      }
    }
  }
})
