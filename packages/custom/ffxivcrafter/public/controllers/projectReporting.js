'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectReportingController', ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.project = {}
    $scope.log = []

    $scope.updateData = function() {
      $scope.project = Project.query({ id: $stateParams.projectId })
      $scope.log = ProjectStockChange.query({projectId: $stateParams.projectId})
    }

    $scope.updateData()


    $scope.logFilter = {
      numLogItems: 10,
      beginLogItems: 0,
      itemNameFilter: '',
      submitterNameFilter: ''
    }

    $scope.logFilterFunction = function (logItem) {
      var result = true

      result = result && logItem.item.name.toLowerCase().search($scope.logFilter.itemNameFilter.toLowerCase()) !== -1

      result = result && logItem.submitter.name.toLowerCase().search($scope.logFilter.submitterNameFilter.toLowerCase()) !== -1

      return result
    }

    socket.on('project stock changed', function (data) {
      if($stateParams.projectId === data.projectId) {
        $scope.updateData()
      }
    })
  }
])
