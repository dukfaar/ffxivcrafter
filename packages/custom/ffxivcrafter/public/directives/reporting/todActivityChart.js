'use strict'

angular.module('mean.ffxivCrafter').directive('reportingTodActivityChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/todActivityChart.html',
    scope: {
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

      $scope.updateGraph = function (log) {
        var groupedByHour = _.countBy(log, function (logItem) {
          var d = new Date(logItem.date)

          return d.getHours()
        })

        var groupedByHourWithZero = ChartService.fillDataWithZero(groupedByHour, 0, 24, function (hour) { return ++hour })

        $scope.chart.data = _.values(groupedByHourWithZero)
        $scope.chart.labels = _.keys(groupedByHourWithZero)
      }

      $scope.$on('stockchangelog was refiltered', function (event, data) { $scope.updateGraph(data) })
    }
  }
})
