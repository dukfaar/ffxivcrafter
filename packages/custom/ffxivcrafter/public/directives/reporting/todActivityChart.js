'use strict'

angular.module('mean.ffxivCrafter').directive('reportingTodActivityChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/todActivityChart.html',
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
        var groupedByHour = _.countBy($scope.log, function (logItem) {
          var d = new Date(logItem.date)

          return d.getHours()
        })

        var groupedByHourWithZero = ChartService.fillDataWithZero(groupedByHour, 0, 24, function (hour) { return ++hour })

        $scope.chart.data = _.values(groupedByHourWithZero)
        $scope.chart.labels = _.keys(groupedByHourWithZero)
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
