'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingController', ['$scope', 'Global', '$http', '$mdDialog',
  function ($scope, Global, $http, $mdDialog) {
    $scope.itemList = null

    $scope.craftingData = {}

    $scope.filter = ''

    $scope.order = {
      amount: 1
    }

    $scope.updateList = function () {
      var url = '/api/item'
      if ($scope.filter !== '') {
        url = '/api/item/filteredList/' + $scope.filter
      }

      $http.get(url, {params: {limit: 10}})
        .then(function (response) {
          $scope.itemList = response.data.list
        })
    }

    $scope.updateList()

    $scope.selectedItem = null

    $scope.selectItem = function (item) {
      $scope.selectedItem = item

      $http.get('/api/crafting/' + item._id)
        .then(function (response) {
          $scope.craftingData = response.data
        })
    }

    $scope.projectFromItem = function (item) {
      console.log($scope.order.amount)
      $http.post('/api/project/fromItem/' + item._id + '/' + $scope.order.amount)
        .then(function (response) {})
    }
  }
])
