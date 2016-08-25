'use strict';

angular.module('mean.system').controller('ItemSelectionDialogController', ['$scope', '$mdDialog',
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
