'use strict'

angular.module('mean.ffxivCrafter').controller('EditKanbanCardDialogController',
  function ($scope, $mdDialog, MeanUser, card) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.card = card

    $scope.hide = function () {
      $mdDialog.hide()
    }
    $scope.cancel = function () {
      $mdDialog.cancel()
    }
    $scope.save = function () {
      $mdDialog.hide(card)
    }
  }
)
