'use strict'

angular.module('mean.ffxivCrafter').controller('ItemPriceDialogController',
  function ($scope, $mdDialog, $http, item, priceUpdate) {
    $scope.item = item

    $scope.hide = function () {
      $mdDialog.hide()
    }

    $scope.update = function () {
      $http.put('/api/item/' + item._id, item)
        .then(function (response) {
          priceUpdate()(item)
        })
    }

    $scope.close = function () {
      $mdDialog.hide()
    }
  }
)
