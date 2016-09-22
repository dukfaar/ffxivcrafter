'use strict'

angular.module('mean.ffxivCrafter').controller('DeliveryDialogController',
  function ($scope, $mdDialog, item, gathers) {
    $scope.amount = 0
    $scope.item = item
    $scope.gathers = gathers

    $scope.hide = function () {
      $mdDialog.hide()
    }
    $scope.cancel = function () {
      $mdDialog.cancel()
    }
    $scope.deliver = function () {
      $mdDialog.hide($scope.amount)
    }
  }
)
