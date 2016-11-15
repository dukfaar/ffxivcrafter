'use strict'

angular.module('mean.ffxivCrafter').controller('CraftingReportingController',
  ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams', '_', '$compile', '$document', 'ReportingFilterService', 'ItemDatabase',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams, _, $compile, $document, ReportingFilterService, ItemDatabase) {
    $scope.ItemDatabase = ItemDatabase
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.log = []
    $scope.filteredLog = []
    $scope.ReportingFilterService = ReportingFilterService

    $scope.updateChange = function (logItem) {
      ProjectStockChange.update({id: logItem._id}, logItem)
    }

    $scope.refilterLog = function () {
      $scope.filteredLog = ReportingFilterService.filterLog($scope.log)
    }

    $scope.$watch('log', function () {
      $scope.refilterLog()
    }, true)

    $scope.updateData = function() {
      $scope.log = ProjectStockChange.query({populate: 'submitter project recipe'})
      $scope.log.$promise.then(function () { 
        _.forEach($scope.log, function (logEntry) {
          logEntry.item = ItemDatabase.get(legEntry.item)
        })
      })
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
