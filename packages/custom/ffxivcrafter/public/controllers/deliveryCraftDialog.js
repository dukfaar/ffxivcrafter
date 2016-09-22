'use strict'

angular.module('mean.ffxivCrafter').controller('DeliveryCraftDialogController',
  function ($scope, $mdDialog, item, craftable) {
    $scope.data = {
      amount: 0,
      craftedFromStock: true,
      item: item,
      craftable: craftable
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
