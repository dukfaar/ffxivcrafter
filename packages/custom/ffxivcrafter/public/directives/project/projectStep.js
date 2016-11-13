'use strict'

angular.module('mean.ffxivCrafter').directive('projectStep', function ($mdDialog, $rootScope, $http, localStorageService) {
  return {
    templateUrl: '/ffxivCrafter/views/project/projectStep.html',
    scope: {
      step: '=',
      stepDeletion: '=',
      updateStep: '&',
      priceUpdate: '&',
      deletedStep: '&',
      showDeleter: '=',
      projectData: '='
    },
    controller: function ($scope) {
      $scope.update = function () {
        $scope.updateStep()($scope.step)
      }

      if ($rootScope.showingAllProjectStepChildren === true) {
        $scope.hideChildren = false
      } else {
        if (localStorageService.get('hideChildren_' + $scope.step._id) === null) {
          localStorageService.set('hideChildren_' + $scope.step._id, true)
        }
        $scope.hideChildren = localStorageService.get('hideChildren_' + $scope.step._id)
      }

      $scope.deleteStep = function () {
        $http.delete('/api/projectstep/' + $scope.step._id)
          .then(function (response) {
            $scope.deletedStep()()
          })
      }

      $scope.toggleChildren = function () {
        $scope.hideChildren = !$scope.hideChildren

        localStorageService.set('hideChildren_' + $scope.step._id, $scope.hideChildren)
      }

      $rootScope.$on('showAllProjectStepChildren', function () {
        $scope.hideChildren = false
        localStorageService.set('hideChildren_' + $scope.step._id, $scope.hideChildren)
      })
      $rootScope.$on('hideAllProjectStepChildren', function () {
        $scope.hideChildren = true
        localStorageService.set('hideChildren_' + $scope.step._id, $scope.hideChildren)
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

      $scope.percentageDone = function () {
        return 100 * (Math.min(1, $scope.projectData.stepData[$scope.step._id].amountDone / $scope.step.amount))
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
          templateUrl: 'ffxivCrafter/views/item/priceDialogFront.html',
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
