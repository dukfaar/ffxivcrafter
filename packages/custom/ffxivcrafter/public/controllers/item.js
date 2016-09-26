'use strict'

angular.module('mean.ffxivCrafter').controller('ItemController', ['$scope', 'Global', '$http', '$mdDialog', 'MeanUser', 'ItemService',
  function ($scope, Global, $http, $mdDialog, MeanUser, ItemService) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.itemService = ItemService

    $scope.createItem = function () {
      $http.post('/api/item')
        .then(function (response) {
          $scope.itemService.updateList()
        })
    }

    $scope.updateItem = function (item) {
      $http.put('/api/item/' + item._id, item)
        .then(function (response) {})
    }

    $scope.updateItemPrice = function (item) {
      $http.put('/api/price/' + item._id + '/' + item.price + '/' + item.priceHQ)
        .then(function (response) {

        })
    }

    $scope.deleteItem = function (item) {
      $http.delete('/api/item/' + item._id, item)
        .then(function (response) {
          $scope.itemService.updateList()
        })
    }

    $scope.openImport = function () {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/item/importDialog.html',
        parent: angular.element(document.body),
        controller: 'ItemImportDialogController',
        clickOutsideToClose: true
      })
    }

    $scope.itemService.updateList()
  }
])
