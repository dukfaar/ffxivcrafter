'use strict'

angular.module('mean.ffxivCrafter').controller('DeliveryCraftDialogController',
  function ($scope, $mdDialog, item, craftable, MeanUser, ItemDatabase) {
    $scope.ItemDatabase = ItemDatabase
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.data = {
      amount: 0,
      craftedFromStock: true,
      item: item,
      craftable: craftable,
      dontUseForContribution: false
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
