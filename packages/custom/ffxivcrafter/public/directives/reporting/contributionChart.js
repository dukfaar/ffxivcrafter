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
        options: {}
      }

      $scope.updateGraph = function () {
        var groupedByUser = _.groupBy($scope.log, function (logItem) { return logItem.submitter.name })
        var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
          return _.reduce(userLogs, function (sum, logEntry) {
            var logValue = 0
            if(logEntry.amount > 0) logValue = logEntry.amount * (Math.log(logEntry.item.gatheringLevel + logEntry.item.gatheringEffort))
            return sum + logValue
          }, 0)
        })
        $scope.chart.data = _.values(countedByUser)
        $scope.chart.labels = _.keys(countedByUser)
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
