'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserContributionChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/userContributionChart.html',
    scope: {
      log: '='
    },
    controller: function ($scope, _) {
      $scope.chart = {
        data: [],
        labels: [],
        options: {},
        summedContribution: 0
      }

      $scope.updateGraph = function () {
        var groupedByUser = _.groupBy($scope.log, function (logItem) { return logItem.submitter.name })
        var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
          return _.reduce(userLogs, function (sum, logEntry) {
            var logValue = 0
            var levelValue = logEntry.item.gatheringLevel + logEntry.item.gatheringEffort
            if(logEntry.recipe) levelValue += logEntry.recipe.craftingLevel
            if(logEntry.amount > 0) logValue = logEntry.amount * (Math.log(levelValue))
            return sum + logValue
          }, 0)
        })
        $scope.chart.data = _.values(countedByUser)
        $scope.chart.labels = _.keys(countedByUser)
        $scope.chart.summedContribution = _.reduce($scope.chart.data, function(sum, d) { return sum + d }, 0)
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
