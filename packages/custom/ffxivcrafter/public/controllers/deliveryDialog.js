'use strict';

angular.module('mean.system').controller('DeliveryDialogController',
  function ($scope, $mdDialog, item) {
    $scope.amount=0;
    $scope.item=item;

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.deliver = function() {
      $mdDialog.hide($scope.amount);
    };
  }
);
