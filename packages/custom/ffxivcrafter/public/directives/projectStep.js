'use strict'

angular.module('mean.ffxivCrafter').directive('projectStep', function ($mdDialog, $rootScope, $http) {
  return {
    templateUrl: '/ffxivCrafter/views/project/projectStep.html',
    scope: {
      step: '=',
      stepDeletion: "=",
      updateStep: '&',
      priceUpdate: '&',
      deletedStep: '&',
      showDeleter: '='
    },
    controller: function ($scope) {
      $scope.update = function () {
        $scope.updateStep()($scope.step)
      }

      $scope.hideChildren = $rootScope.showingAllProjectStepChildren===true?false:true

      $scope.deleteStep = function() {
        $http.delete('/api/projectstep/'+$scope.step._id)
        .then(function(response) {

          $scope.deletedStep()()
        })
      }

      $scope.toggleChildren = function () { $scope.hideChildren = !$scope.hideChildren }

      $rootScope.$on('showAllProjectStepChildren', function () {
        $scope.hideChildren = false
      })
      $rootScope.$on('hideAllProjectStepChildren', function () {
        $scope.hideChildren = true
      })

      $scope.toggleHQ = function () {
        $scope.step.hq = !$scope.step.hq
        $scope.updateStep()($scope.step)
      }

      $scope.outputStepPrice = function (step) {
        return step.amount * (step.item ? (step.hq ? step.item.priceHQ : step.item.price) : 0)
      }

      $scope.inputPriceSum = function (step) {
        var sum = 0

        step.inputs.forEach(function (input) {
          sum += $scope.outputStepPrice(input)
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
        }).then(function () {})
      }
    }
  }
})
