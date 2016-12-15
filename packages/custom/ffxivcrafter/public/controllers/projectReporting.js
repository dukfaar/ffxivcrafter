'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectReportingController',
  ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams', '_', '$compile', '$document', 'ReportingFilterService', 'ItemDatabase', 'RecipeDatabase', 'ProjectDatabase',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams, _, $compile, $document, ReportingFilterService, ItemDatabase, RecipeDatabase, ProjectDatabase) {
    $scope.ItemDatabase = ItemDatabase
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.log = []
    $scope.filteredLog = []
    $scope.ReportingFilterService = ReportingFilterService

    $scope.data = {
      itemGetsInProgress: 0
    }

    $scope.updateChange = function (logItem) {
      ProjectStockChange.update({id: logItem._id}, logItem)
    }

    $scope.refilterLog = function () {
      $scope.filteredLog = ReportingFilterService.filterLog($scope.log)
    }

    $scope.$watch('log', function () {
      if($scope.data.itemGetsInProgress == 0) $scope.refilterLog()
    }, true)

    $scope.$watch('data.itemGetsInProgress', function () {
      if($scope.data.itemGetsInProgress == 0) $scope.refilterLog()
    })


    $scope.updateData = function () {
      $scope.log = ProjectStockChange.query({projectId: $stateParams.projectId, populate: 'submitter'})
      $scope.log.$promise.then(function () {
        $scope.data.itemGetsInProgress = $scope.log.length

        _.forEach($scope.log, function (logEntry) {
          logEntry.item = ItemDatabase.get(logEntry.item)
          logEntry.item.$promise.then(function() {
            $scope.data.itemGetsInProgress--
          })
          logEntry.project = logEntry.project?ProjectDatabase.get(logEntry.project):null
          logEntry.recipe = logEntry.recipe?RecipeDatabase.get(logEntry.recipe):null
        })
      })
    }

    $scope.updateData()

    var updateTimeout = null

    socket.on('new project stock change', function (data) {
      if ($stateParams.projectId === data.projectId) {
        if (updateTimeout) clearTimeout(updateTimeout)
        updateTimeout = setTimeout(function () {
          updateTimeout = null
          $scope.updateData()
        }, 200)
      }
    })
  }
])
