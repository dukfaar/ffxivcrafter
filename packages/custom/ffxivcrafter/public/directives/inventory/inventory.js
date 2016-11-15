'use strict'

angular.module('mean.ffxivCrafter').directive('rcInventory',function() {
  return {
    templateUrl:'/ffxivCrafter/views/users/inventory.html',
    controller: function($scope, Inventory, ItemService, _, $http, MeanUser, Recipe, ItemDatabase) {
      $scope._ = _
      $scope.itemService = ItemService
      $scope.ItemDatabase = ItemDatabase

      $scope.inventory = {}
      $scope.recipes = Recipe.query({})
      $scope.craftables = []

      function isCraftable (inventory, recipe) {
        return _.every(recipe.inputs, function (input) {
          var invItem = _.find(inventory.items, function (item) {
            return item.item.toString() === input.item.toString()
          })
          return invItem && invItem.amount >= input.amount
        })
      }

      function updateCraftables () {
        $scope.recipes.$promise.then(function () {
          $scope.craftables = _.filter($scope.recipes, function (recipe) { return isCraftable($scope.inventory, recipe) })
        })
      }

      updateCraftables()

      $scope.inputSum = function(recipe) {
        var prices = _.map(recipe.inputs, function (input) { return ItemDatabase.get(input.item).price })
        return _.reduce(prices, function (sum, price) { return sum + price }, 0)
      }

      $scope.selectItem = function(item) {
        $scope.inventory.items.push({item: item._id, amount: 1})
        Inventory.update({ id: $scope.inventory._id }, $scope.inventory)
        updateCraftables()
      }

      $scope.removeItem = function(item) {
        $scope.inventory.items = _.reject($scope.inventory.items, function (invItem) { return item._id === invItem })
        Inventory.update({ id: $scope.inventory._id }, $scope.inventory)
        updateCraftables()
      }

      Inventory.query({userInventory: true }).$promise.then(function (result) {
        if(result.length === 0) {
          Inventory.create().$promise.then()
          .then(function(newInventory) {
            newInventory.user = MeanUser.user._id
            return Inventory.update({ id: newInventory._id }, newInventory).$promise
          })
          .then(function(savedInventory) {
            $scope.inventory = savedInventory
          })
        } else {
          $scope.inventory = result[0]
        }
      })

      $scope.updateInventory = function() {
        Inventory.update({ id: $scope.inventory._id }, $scope.inventory)
      }
    }
  }
})
