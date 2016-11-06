'use strict'

angular.module('mean.ffxivCrafter').directive('reportingDowActivityChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/dowActivityChart.html',
    scope: {
      log: '='
    },
    controller: function ($scope, _, ChartService) {
      $scope.chart = {
        data: [],
        labels: [],
        options: {
          scales: {
            yAxes: [{
              type: 'linear',
              ticks: {
                min: 0
              }
            }]
          }
        }
      }

      $scope.updateGraph = function () {
        var groupedByDay = _.countBy($scope.log, function (logItem) {
          var d = new Date(logItem.date)

          return d.getDay()
        })

        var groupedByDayWithZero = ChartService.fillDataWithZero(groupedByDay, 0, 7, function (day) { return ++day })

        $scope.chart.data = _.values(groupedByDayWithZero)
        $scope.chart.labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
