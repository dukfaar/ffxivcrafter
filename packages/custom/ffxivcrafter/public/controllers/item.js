'use strict'

angular.module('mean.ffxivCrafter').controller('ItemController', ['$scope', 'Global', '$http', '$mdDialog', 'MeanUser', 'ItemService', '_',
  function ($scope, Global, $http, $mdDialog, MeanUser, ItemService, _) {
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
    }

    $scope.updateItemPrice = function (item) {
      $http.put('/api/price/' + item._id + '/' + item.price + '/' + item.priceHQ)
    }

    $scope.deleteItem = function (item) {
      $http.delete('/api/item/' + item._id, item)
        .then(function (response) {
          $scope.itemService.updateList()
        })
    }

    $scope.editItem = function (item) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/item/editDialog.html',
        parent: angular.element(document.body),
        controller: function ($scope, $mdDialog, item) {
          $scope.item = $.extend({}, item, true)
          $scope.save = function () {
            $mdDialog.hide($scope.item)
          }
          $scope.hide = function () {
            $mdDialog.hide()
          }
          $scope.cancel = function () {
            $mdDialog.cancel()
          }
        },
        clickOutsideToClose: true,
        locals: {
          item: item
        }
      }).then(function (data) {
        $scope.updateItem(data)
        _.assign(item, data)
      })
    }

    $scope.multiplierUpdatesDone = false

    $scope.triggerAgeMultiplierUpdate = function() {
      $scope.multiplierUpdatesDone = false
      $scope.multiplierUpdatesRunning = true
      $http.put('/api/item/updateAllAgeMultipliers')
      .then(function(response) {
        $scope.multiplierUpdatesRunning = false
        $scope.multiplierUpdatesDone = true
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
