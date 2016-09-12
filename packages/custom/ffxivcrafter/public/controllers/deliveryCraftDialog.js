'use strict'

angular.module('mean.ffxivCrafter').controller('DeliveryCraftDialogController',
  function ($scope, $mdDialog, item) {
    $scope.data = {
      amount: 0,
      craftedFromStock: true,
      item: item
    }

    $scope.hide = function () {
      $mdDialog.hide()
    }
    $scope.cancel = function () {
      $mdDialog.cancel()
    }
    $scope.deliver = function () {
      $mdDialog.hide($scope.data)
    }
  }
)
