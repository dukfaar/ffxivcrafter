'use strict'

angular.module('mean.ffxivCrafter').controller('ItemPriceDialogController',
  function ($scope, $mdDialog, $http, item) {
    $scope.item = item

    $scope.hide = function () {
      $mdDialog.hide()
    }

    $scope.update = function () {
      $http.put('/api/price/' + $scope.item._id + '/' + $scope.item.price + '/' + $scope.item.priceHQ)
    }

    $scope.close = function () {
      $mdDialog.hide()
    }
  }
)
