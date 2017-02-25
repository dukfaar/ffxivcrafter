'use strict'

angular.module('mean.ffxivCrafter').directive('projectManagerOverview', function () {
  return {
    templateUrl: '/ffxivCrafter/views/projectManager/overview.html',
    controller: function ($scope, Global, $http, $timeout, $q, _, Project, ItemDatabase, ContributionService, ProjectStockChange, ProjectDatabase, RecipeDatabase) {
      $scope.allProjects = Project.query({})
      $scope.orderProjects = []
      $scope.publicProjects = []
      $scope.sellingProjects = []
      $scope.soldProjects = []
      $scope.ItemDatabase = ItemDatabase
      $scope.overviewFilter = ''

      $scope.ccStock = {}

      $scope.data = {

      }

      function getAndProcessProject(project) {
        var log = ProjectStockChange.query({projectId: project._id, populate: 'submitter'})
        return log.$promise.then(() => {
          _.forEach(log, function (logEntry) {
            logEntry.item = ItemDatabase.get(logEntry.item)
            logEntry.project = logEntry.project ? ProjectDatabase.get(logEntry.project) : null
            logEntry.recipe = logEntry.recipe ? RecipeDatabase.get(logEntry.recipe) : null
          })

          var itemPromises = _.map(log, function (logEntry) { return logEntry.item.$promise })
          var recipePromises = _.reject(_.map(log, function (logEntry) { return logEntry.recipe ? logEntry.recipe.$promise : null }), _.isNull)
          var projectPromises = _.reject(_.map(log, function (logEntry) { return logEntry.project ? logEntry.project.$promise : null }), _.isNull)

          return $q.all(_.flatten([itemPromises, recipePromises, projectPromises]))
        })
        .then(()=>{
          return ContributionService.processLog(log)
        })
      }

      $scope.allProjects.$promise.then(function () {
        $scope.orderProjects = _.filter($scope.allProjects, function (project) { return project.order })
        $scope.publicProjects = _.filter($scope.allProjects, function (project) { return project.public && !project.private })
        $scope.sellingProjects = _.filter($scope.allProjects, function (project) { return !project.private && project.state === 'Selling' })
        $q.all(_.map($scope.sellingProjects, getAndProcessProject))
        .then((result) => { $scope.data.sellingProjectsContributions = result })
        .then(() => {
          $scope.data.sellingProjectsContributionsSum = _.map($scope.data.sellingProjectsContributions, (contributions) => {
            return _.sum(_.values(contributions))
          })
        })
        .then(() => {
          $scope.data.sellingProjectsSummary = {
            total: 0,
            values: {}
          }
          _.forEach($scope.sellingProjects, (project, index) => {
            $scope.data.sellingProjectsSummary.total += project.price

            _.forEach(_.keys($scope.data.sellingProjectsContributions[index]), (key) => {
              if(!$scope.data.sellingProjectsSummary.values[key]) $scope.data.sellingProjectsSummary.values[key] = 0
              $scope.data.sellingProjectsSummary.values[key] += ($scope.data.sellingProjectsContributions[index][key]/$scope.data.sellingProjectsContributionsSum[index])*project.price
            })
          })
        })

        $scope.soldProjects = _.filter($scope.allProjects, function (project) { return !project.private && project.state === 'Sold' })
        $q.all(_.map($scope.soldProjects, getAndProcessProject))
        .then((result) => { $scope.data.soldProjectsContributions = result })
        .then(() => {
          $scope.data.soldProjectsContributionsSum = _.map($scope.data.soldProjectsContributions, (contributions) => {
            return _.sum(_.values(contributions))
          })
        })
        .then(() => {
          $scope.data.soldProjectsSummary = {
            total: 0,
            values: {}
          }
          _.forEach($scope.soldProjects, (project, index) => {
            $scope.data.soldProjectsSummary.total += project.price

            _.forEach(_.keys($scope.data.soldProjectsContributions[index]), (key) => {
              if(!$scope.data.soldProjectsSummary.values[key]) $scope.data.soldProjectsSummary.values[key] = 0
              $scope.data.soldProjectsSummary.values[key] += ($scope.data.soldProjectsContributions[index][key]/$scope.data.soldProjectsContributionsSum[index])*project.price
            })
          })
        })

        $scope.ccStock = {}
        _.forEach($scope.publicProjects, function (project) {
          _.forEach(project.stock, function (stockItem) {
            if (!$scope.ccStock[stockItem.item + '_' + stockItem.hq]) {
              $scope.ccStock[stockItem.item + '_' + stockItem.hq] = {item: ItemDatabase.get(stockItem.item), hq: stockItem.hq, amount: stockItem.amount}
            } else {
              $scope.ccStock[stockItem.item + '_' + stockItem.hq].amount += stockItem.amount
            }
          })
        })

        $scope.ccStockArray = Object.keys($scope.ccStock).map(function (key) {
          return $scope.ccStock[key]
        })
      })
    }
  }
})
