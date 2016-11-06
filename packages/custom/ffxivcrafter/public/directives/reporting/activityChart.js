'use strict'

angular.module('mean.ffxivCrafter').directive('reportingActivityChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/activityChart.html',
    scope: {
      log: '='
    },
    controller: function ($scope, _) {
      $scope.chart = {
        data: [],
        options: {
          scales: {
            yAxes: [{
              type: 'linear',
              ticks: {
                min: 0
              }
            }],
            xAxes: [{
              type: 'time'
            }]
          }
        }
      }

      $scope.timeUnit = 'day'

      $scope.setTimeUnit = function (unit) {
        $scope.timeUnit = unit
        $scope.updateGraph()
      }

      function incrementDate (d) {
        if ($scope.timeUnit === 'minute') d.setMinutes(d.getMinutes() + 1)
        else if ($scope.timeUnit === 'hour') d.setHours(d.getHours() + 1)
        else if ($scope.timeUnit === 'day') d.setDate(d.getDate() + 1)
      }

      $scope.updateGraph = function () {
        var countedByDateWithZero = {}

        if ($scope.log.length !== 0) {
          var countedByDate = _.countBy($scope.log, function (logItem) {
            var d = new Date(logItem.date)
            if($scope.timeUnit === 'day') d.setHours(0)
            if($scope.timeUnit === 'day' || $scope.timeUnit === 'hour') d.setMinutes(0)
            if($scope.timeUnit === 'day' || $scope.timeUnit === 'hour' || $scope.timeUnit === 'minute') d.setSeconds(0)
            d.setMilliseconds(0)

            return d
          })

          var keys = _.map(_.keys(countedByDate), function (d) { return new Date(d) })

          var minDate = _.min(keys)
          var maxDate = _.max(keys)

          incrementDate(maxDate)


          for(var curDate=new Date(minDate.getTime());curDate.getTime()<maxDate.getTime();) {
            if(!countedByDate[curDate]) countedByDateWithZero[curDate] = 0
            else countedByDateWithZero[curDate] = countedByDate[curDate]

            incrementDate(curDate)
          }
        }

        $scope.chart.data = _.values(countedByDateWithZero)
        $scope.chart.labels = _.keys(countedByDateWithZero)
      }

      $scope.$watch('log', $scope.updateGraph, true)
    }
  }
})
