'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserContributionChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/userContributionChart.html',
    scope: {
    },
    controller: function ($scope, _, ContributionService) {
      $scope.ContributionService = ContributionService

      $scope.chart = {
        data: [],
        labels: [],
        options: {},
        summedContribution: 0,
        dataArray: []
      }

      $scope.lastLog = []

      $scope.config = {
        showDiagram: false
      }

      $scope.functionData = {
        showCode: false,
      }

      $scope.setDefaultCode = function () {
        ContributionService.setDefaultCode()
      }

      $scope.$watch('ContributionService.data.code', function () {
        ContributionService.setAndCompileCode()
        $scope.updateGraph($scope.lastLog)
      })

      $scope.updateGraph = function (log) {
        var countedByUser = ContributionService.processLog(log)
        $scope.chart.data = _.values(countedByUser)
        $scope.chart.labels = _.keys(countedByUser)
        $scope.chart.dataArray = _.values(_.mapValues(countedByUser, function (value, key) { return { user: key, value: value } }))
        $scope.chart.summedContribution = _.reduce($scope.chart.data, function (sum, d) { return sum + d }, 0)
      }

      $scope.$on('stockchangelog was refiltered', function (event, data) {
        $scope.lastLog = data
        $scope.updateGraph($scope.lastLog)
      })
    }
  }
})
