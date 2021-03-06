'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectReportingController',
  ['$scope', '$rootScope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ProjectStockChange', 'Project', '$stateParams', '_', '$compile', '$document', 'ReportingFilterService', 'ItemDatabase', 'RecipeDatabase', 'ProjectDatabase',
    function ($scope, $rootScope, $http, socket, MeanUser, $q, localStorageService, ProjectStockChange, Project, $stateParams, _, $compile, $document, ReportingFilterService, ItemDatabase, RecipeDatabase, ProjectDatabase) {
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
        $scope.$broadcast('stockchangelog was refiltered', $scope.filteredLog)
      }

      $scope.updateData = function () {
        var log = ProjectStockChange.query({projectId: $stateParams.projectId, populate: 'submitter'})
        log.$promise.then(function () {
          _.forEach(log, function (logEntry) {
            logEntry.item = ItemDatabase.get(logEntry.item)
            logEntry.project = logEntry.project ? ProjectDatabase.get(logEntry.project) : null
            logEntry.recipe = logEntry.recipe ? RecipeDatabase.get(logEntry.recipe) : null
          })

          var itemPromises = _.map(log, function (logEntry) { return logEntry.item.$promise })
          var recipePromises = _.reject(_.map(log, function (logEntry) { return logEntry.recipe ? logEntry.recipe.$promise : null }), _.isNull)
          var projectPromises = _.reject(_.map(log, function (logEntry) { return logEntry.project ? logEntry.project.$promise : null }), _.isNull)

          $q.all(_.flatten([itemPromises, recipePromises, projectPromises])).then(function () {
            $scope.log = log
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
