'use strict'

angular.module('mean.ffxivCrafter').controller('ConfirmOrderDialogController',
  function ($scope, $mdDialog, MeanUser, order) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.data = {
      order: order
    }

    $scope.hide = function () {
      $mdDialog.hide()
    }
    $scope.cancel = function () {
      $mdDialog.cancel()
    }
    $scope.order = function () {
      $mdDialog.hide(order)
    }
  }
)
