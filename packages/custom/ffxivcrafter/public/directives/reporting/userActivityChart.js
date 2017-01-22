'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserActivityChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/userActivityChart.html',
    scope: {
    },
    controller: function ($scope, _) {
      $scope.chart = {
        data: [],
        labels: [],
        options: {}
      }

      $scope.updateGraph = function (log) {
        var countedByUser = _.countBy(log, function (logItem) { return logItem.submitter.name })
        $scope.chart.data = _.values(countedByUser)
        $scope.chart.labels = _.keys(countedByUser)
      }

      $scope.$on('stockchangelog was refiltered', function (event, data) { $scope.updateGraph(data) })
    }
  }
})
