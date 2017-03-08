'use strict'

angular.module('mean.ffxivCrafter').controller('DeliveryDialogController',
  function ($scope, $mdDialog, item, gathers, MeanUser, Analytics) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.item = item
    $scope.gathers = gathers
    $scope.data = {
      dontUseForContribution: false,
      amount: 0
    }

    $scope.hide = function () {
      Analytics.trackEvent(['gatherDialog', 'closed', 'hide'])
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
