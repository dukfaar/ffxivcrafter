'use strict';

angular.module('mean.ffxivCrafter').controller('ItemSelectionDialogController', ['$scope', '$mdDialog',
  function ($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.selectItem = function(item) {
      $mdDialog.hide(item);
    };
  }
]);
