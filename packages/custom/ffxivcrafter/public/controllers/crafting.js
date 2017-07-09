'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingController',
['$scope', 'Global', '$http', '$mdDialog', 'ItemService', 'socket', '$mdToast',
  function ($scope, Global, $http, $mdDialog, ItemService, socket, $mdToast) {
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
      .then(function (result) {
        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Project has been created.')
            .position('bottom right')
            .hideDelay(5000)
            .highlightClass('md-accent')
          )
      })
    }

    $scope.template = {
      text: ""
    }

    $scope.projectFromTemplate = function () {
      $http.post('/api/project/fromTemplate', {template: $scope.template.text})
      .then(function (result) {
        $mdToast.show(
          $mdToast
            .simple()
            .textContent('Project has been created.')
            .position('bottom right')
            .hideDelay(5000)
            .highlightClass('md-accent')
          )
      })
    }

    $scope.addToProject = function (item, project) {
      if (!project) return

      $http.post('/api/project/addToProject/' + item._id + '/' + $scope.order.amount + '/' + project._id)
    }
  }
])
