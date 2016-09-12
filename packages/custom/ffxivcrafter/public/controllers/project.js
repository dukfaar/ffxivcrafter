'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectController', ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService',
  function ($scope, Global, $http, $mdDialog, projectAnalyzerService) {
    $scope.projectList = []
    $scope.projectData = {}

    $scope.gatherFilter = ''
    $scope.gatherTotalFilter = ''
    $scope.craftableFilter = ''
    $scope.stockFilter = ''

    $scope.isGatherOutsanding = function (gather) {
      return gather.outstanding > 0
    }

    $scope.addToStock = function (project, item, amount) {
      $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + amount)
        .then(function (result) {
          $scope.updateList()
        })
    }

    $scope.setStock = function (project, item, amount) {
      $http.post('/api/project/stock/set/' + project._id + '/' + item._id + '/' + amount)
        .then(function (result) {
          $scope.updateList()
        })
    }

    $scope.updateProject = function (project) {
      $http.put('/api/project/' + project._id, project)
        .then(function (response) {
          $scope.projectData = {}
          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
        })
    }

    $scope.deleteProject = function (project) {
      $http.delete('/api/project/' + project._id)
        .then(function (response) {
          $scope.updateList()
        })
    }

    $scope.updateStep = function (step) {
      console.log('meowmeow')
      $http.put('/api/projectstep/' + step._id, step)
        .then(function (response) {
          $scope.projectData = {}
          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
        })
    }

    $scope.updateList = function () {
      var url = '/api/project'

      $http.get(url)
        .then(function (response) {
          $scope.projectData = {}

          $scope.projectList = response.data

          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
        })
    }

    $scope.createProject = function () {
      $http.post('/api/project')
        .then(function (response) {
          $scope.updateList()
        })
    }

    $scope.toArray = function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key]
      })
    }

    $scope.updateList()
  }
])
