'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserActivityChart',function() {
  return {
    templateUrl:'/ffxivCrafter/views/reporting/userActivityChart.html',
    scope: {
      log: "="
    },
    controller: function($scope, _) {
      $scope.chart = {
        data: [],
        labels: [],
        options: {}
      }

      $scope.updateGraph = function () {
        var countedByUser = _.countBy($scope.log, function (logItem) { return logItem.submitter.name })
        $scope.chart.data = _.values(countedByUser)
        $scope.chart.labels = _.keys(countedByUser)
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
