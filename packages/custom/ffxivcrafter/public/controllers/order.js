'use strict'

angular.module('mean.ffxivCrafter').controller('OrderController', ['$scope', 'Global', '$http', '$mdDialog', 'ItemService', 
  function ($scope, Global, $http, $mdDialog, ItemService) {
    $scope.itemService = ItemService

    $scope.order = {
      amount: 1,
      comment: ''
    }

    $scope.updateList = function () {
      ItemService.updateList({privileged:true})
    }

    $scope.updateList()

    $scope.selectedItem = null

    function processRecipe (recipe, multiplier) {
      angular.forEach(recipe.inputs, function (value, key) {
        $http.get('/api/recipe/by_output/' + value.item._id)
          .then(function (response) {
            if (response.data.length > 0) {
              processRecipe(response.data[0], 1)
            } else {
              if (!$scope.craftingMaterials[value.item._id]) {
                $scope.craftingMaterials[value.item._id] = {item: value.item,amount: 0}
              }

              $scope.craftingMaterials[value.item._id].amount += value.amount * multiplier
            }
          })
      })
    }

    $scope.selectItem = function (item) {
      $scope.selectedItem = item

    /*$http.get('/api/crafting/'+item._id)
    .then(function(response) {
      $scope.craftingData=response.data
    });*/
    }

    $scope.orderItem = function (item) {
      $http.post('/api/project/fromItem/' + item._id + '/' + $scope.order.amount, {comment: $scope.order.comment, orderedViaOrderView: true})
        .then(function (response) {})
    }
  }
])
