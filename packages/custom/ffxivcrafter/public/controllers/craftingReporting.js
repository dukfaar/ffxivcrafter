'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingReportingController', ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams', '_',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams, _) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.log = []

    $scope.filteredLog = []

    $scope.logFilter = {
      numLogItems: 10,
      beginLogItems: 0,
      itemNameFilter: '',
      submitterNameFilter: '',
      projectNameFilter: '',
      ignoreContributionFilter: 'dontCare'
    }

    $scope.logFilterFunction = function (logItem) {
      var result = true

      result = result && (logItem.item.name.toLowerCase().search($scope.logFilter.itemNameFilter.toLowerCase()) !== -1)

      result = result && (logItem.submitter.name.toLowerCase().search($scope.logFilter.submitterNameFilter.toLowerCase()) !== -1)

      var projectName = (logItem.project&&logItem.project.name)?logItem.project.name:(logItem.deletedProjectName?logItem.deletedProjectName:'')

      result = result && (projectName.toLowerCase().search($scope.logFilter.projectNameFilter.toLowerCase()) !== -1)

      switch($scope.logFilter.ignoreContributionFilter) {
        case 'dontCare':
          break
        case 'true':
          result = result && logItem.dontUseForContribution
          break
        case 'false':
          result = result && !logItem.dontUseForContribution
          break
      }

      return result
    }

    $scope.updateChange = function (logItem) {
      ProjectStockChange.update({id: logItem._id}, logItem)
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

    var updateTimeout = null

    socket.on('new project stock change', function (data) {
      if(updateTimeout) clearTimeout(updateTimeout)
      updateTimeout = setTimeout(function () {
        updateTimeout = null
        $scope.updateData()
      }, 200)
    })
  }
])
