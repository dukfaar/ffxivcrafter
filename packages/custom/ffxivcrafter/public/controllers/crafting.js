'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingController', ['$scope', 'Global', '$http', '$mdDialog', 'ItemService', 'socket',
  function ($scope, Global, $http, $mdDialog, ItemService, socket) {
    $scope.itemList = null

    $scope.itemService = ItemService
    $scope.selectedProject = null

    $scope.projectList = []

    $scope.updateProjectList = function () {
      var url = '/api/project'

      $http.get(url)
        .then(function (response) {
          $scope.projectList = response.data
        })
    }

    socket.on('new project created', function (data) {
      $scope.updateProjectList()
    })

    $scope.updateProjectList()

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
    }

    $scope.addToProject = function (item, project) {
      if (!project) return

      $http.post('/api/project/addToProject/' + item._id + '/' + $scope.order.amount + '/' + project._id)
    }
  }
])
