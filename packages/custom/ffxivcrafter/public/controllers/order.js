'use strict'

angular.module('mean.ffxivCrafter').controller('OrderController', ['$scope', 'Global', '$http', '$mdDialog', 'ItemService', '$mdToast', '$q', '_',
  function ($scope, Global, $http, $mdDialog, ItemService, $mdToast, $q, _) {
    $scope.itemService = ItemService

    $scope.order = {
      amount: 1,
      comment: '',
      hq: false
    }

    $scope.cart = []

    $scope.updateList = function () {
      ItemService.updateList()
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
                $scope.craftingMaterials[value.item._id] = {item: value.item, amount: 0}
              }

              $scope.craftingMaterials[value.item._id].amount += value.amount * multiplier
            }
          })
      })
    }

    $scope.selectItem = function (item) {
      $scope.selectedItem = item
    }

    function doAddPost (projectId, cartItem) {
      return $http.post('/api/project/addToProject/' + cartItem.item._id + '/' + cartItem.amount + '/' + projectId, {hq: cartItem.hq})
    }

    function performOrder (cart) {
      if (cart.length > 0) {
        $http.post('/api/project/fromItem/' + cart[0].item._id + '/' + cart[0].amount, {
          comment: $scope.order.comment,
          orderedViaOrderView: true,
          hq: cart[0].hq
        }).then(function (response) {
          let projectId = response.data.projectId

          return _.reduce(
            _.slice(cart, 1),
            function (promise, item) {
              return promise.then(function () {
                return doAddPost(projectId, item)
              })
            },
            $q.when()
          )
        }).then(function () {
          $mdToast.show(
          $mdToast
            .simple()
            .textContent('Items where ordered! We will get back to you with details on the pricing.')
            .position('bottom right')
            .hideDelay(5000)
            .highlightClass('md-accent')
          )
        })
      }
    }

    $scope.addItemToCart = function (item, amount, hq) {
      $scope.cart.push({item: item, amount: amount, hq: hq})
    }

    $scope.removeItemFromCart = function (removeIndex) {
      _.remove($scope.cart, function (item, index) { return index === removeIndex })
    }

    $scope.orderCart = function (cart) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/order/confirmOrderDialog.html',
        parent: angular.element(document.body),
        controller: 'ConfirmOrderDialogController',
        clickOutsideToClose: true,
        locals: {
          order: cart
        }
      }).then(function (cart) {
        performOrder(cart)
      })
    }
  }
])
