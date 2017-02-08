'use strict'

angular.module('mean.ffxivCrafter').directive('rcInventory', function () {
  return {
    templateUrl: '/ffxivCrafter/views/inventory/inventory.html',
    controller: function ($scope, Inventory, ItemService, _, $http, UserService, Recipe, ItemDatabase) {
      $scope._ = _
      $scope.itemService = ItemService
      $scope.ItemDatabase = ItemDatabase

      $scope.inventory = {}
      $scope.recipes = Recipe.query({})
      $scope.craftables = []

      function isCraftable (inventory, recipe) {
        return _.every(recipe.inputs, function (input) {
          var invItem = _.find(inventory.items, item => item.item.toString() === input.item.toString())
          return invItem && invItem.amount >= input.amount
        })
      }

      function updateCraftables () {
        $scope.recipes.$promise.then(function () {
          $scope.craftables = _.filter($scope.recipes, recipe => isCraftable($scope.inventory, recipe))
        })
      }

      updateCraftables()

      $scope.inputSum = function (recipe) {
        var prices = _.map(recipe.inputs, input => ItemDatabase.get(input.item).price)
        return _.reduce(prices, (sum, price) => sum + price, 0)
      }

      $scope.updateInventory = function () {
        Inventory.update({ id: $scope.inventory._id }, $scope.inventory)
      }

      $scope.pushUpdateAndUpdateCraftables = function () {
        $scope.updateInventory()
        updateCraftables()
      }

      $scope.addItem = function (item) {
        if (!$scope.inventory.items) $scope.inventory.items = []

        if(!_.find($scope.inventory.items, it => item._id === it._id)) {
          $scope.inventory.items.push({item: item._id, amount: 1})
          $scope.pushUpdateAndUpdateCraftables()
        }
      }

      $scope.removeItem = function (item) {
        if (!$scope.inventory.items) $scope.inventory.items = []
        if(_.find($scope.inventory.items, it => item._id === it._id)) {
          $scope.inventory.items = _.reject($scope.inventory.items, (invItem) => item._id === invItem._id)
          $scope.pushUpdateAndUpdateCraftables()
        }
      }

      Inventory.query({user: UserService.user._id }).$promise.then(function (result) {
        if (result.length === 0) {
          Inventory.create().$promise.then()
          .then(newInventory => {
            newInventory.user = UserService.user._id
            return Inventory.update({ id: newInventory._id }, newInventory).$promise
          })
          .then(savedInventory => {
            $scope.inventory = savedInventory
          })
        } else {
          $scope.inventory = result[0]
        }
      })
    }
  }
})
