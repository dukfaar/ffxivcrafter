'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingController', ['$scope', 'Global', '$http', '$mdDialog', 'ItemService',
  function ($scope, Global, $http, $mdDialog, ItemService) {
    $scope.itemList = null

    $scope.itemService = ItemService

    $scope.order = {
      amount: 1
    }

    $scope.itemService.updateList()

    $scope.selectedItem = null

    $scope.selectItem = function (item) {
      $scope.selectedItem = item

      $http.get('/api/crafting/' + item._id)
        .then(function (response) {
          $scope.craftingData = response.data
        })
    }

    $scope.projectFromItem = function (item) {
      $http.post('/api/project/fromItem/' + item._id + '/' + $scope.order.amount)
        .then(function (response) {})
    }
  }
])
