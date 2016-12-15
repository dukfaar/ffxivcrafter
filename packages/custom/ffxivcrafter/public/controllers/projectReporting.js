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

    $scope.updateChange = function (logItem) {
      ProjectStockChange.update({id: logItem._id}, logItem)
    }

    $scope.refilterLog = function () {
      $scope.filteredLog = ReportingFilterService.filterLog($scope.log)
    }

    $scope.updateData = function () {
      $scope.log = ProjectStockChange.query({projectId: $stateParams.projectId, populate: 'submitter'})
      $scope.log.$promise.then(function () {
        var itemPromises = []

        _.forEach($scope.log, function (logEntry) {
          logEntry.item = ItemDatabase.get(logEntry.item)
          itemPromises.push(logEntry.item.$promise)

          logEntry.project = logEntry.project?ProjectDatabase.get(logEntry.project):null
          logEntry.recipe = logEntry.recipe?RecipeDatabase.get(logEntry.recipe):null
        })

        $q.all(itemPromises).then(function() {
          $scope.refilterLog()
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
