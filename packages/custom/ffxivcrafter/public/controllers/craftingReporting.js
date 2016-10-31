'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingReportingController', ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams', '_',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams, _) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.log = []

    $scope.filteredLog = []

    $scope.logFilterFunction = function (logItem) {
      var result = true

      result = result && (logItem.item.name.toLowerCase().search($scope.logFilter.itemNameFilter.toLowerCase()) !== -1)

      result = result && (logItem.submitter.name.toLowerCase().search($scope.logFilter.submitterNameFilter.toLowerCase()) !== -1)

      var projectName = logItem.project?logItem.project.name:logItem.deletedProjectName

      result = result && (projectName.toLowerCase().search($scope.logFilter.projectNameFilter.toLowerCase()) !== -1)

      return result
    }

    $scope.refilterLog = function() {
      $scope.filteredLog = _.filter($scope.log, $scope.logFilterFunction)
    }

    $scope.$watch('log',function() {
      $scope.refilterLog()
    }, true)

    $scope.updateData = function() {
      $scope.log = ProjectStockChange.query()
    }

    $scope.updateData()

    $scope.logFilter = {
      numLogItems: 10,
      beginLogItems: 0,
      itemNameFilter: '',
      submitterNameFilter: '',
      projectNameFilter: ''
    }

    socket.on('project stock changed', function (data) {
      if($stateParams.projectId === data.projectId) {
        $scope.updateData()
      }
    })
  }
])