'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserContributionChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/userContributionChart.html',
    scope: {
    },
    controller: function ($scope, _, localStorageService) {
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

      $scope.functionList = {
        gatheringLevel: (logEntry, stack) => stack.push(logEntry.item.gatheringLevel),
        gatheringEffort: (logEntry, stack) => stack.push(logEntry.item.gatheringEffort),
        craftingLevel: (logEntry, stack) => stack.push(logEntry.recipe ? logEntry.recipe.craftingLevel : 0),
        amount: (logEntry, stack) => stack.push(logEntry.amount),
        dontUseForContributionFlag: (logEntry, stack) => stack.push(logEntry.dontUseForContribution ? 1 : 0),

        one: (logEntry, stack) => stack.push(1),
        zero: (logEntry, stack) => stack.push(0),

        log: (logEntry, stack) => stack.push(Math.log(stack.pop())),
        multiply: (logEntry, stack) => stack.push(stack.pop() * stack.pop()),
        add: (logEntry, stack) => stack.push(stack.pop() + stack.pop()),
        floor: (logEntry, stack) => stack.push(Math.floor(stack.pop())),
        ceil: (logEntry, stack) => stack.push(Math.ceil(stack.pop())),
        greaterThen: (logEntry, stack) => {
          var v1 = stack.pop()
          var v2 = stack.pop()
          return stack.push(v1 > v2 ? 1 : 0)
        },
        lessThen: (logEntry, stack) => {
          var v1 = stack.pop()
          var v2 = stack.pop()
          return stack.push(v1 < v2 ? 1 : 0)
        },
        equals: (logEntry, stack) => {
          var v1 = stack.pop()
          var v2 = stack.pop()
          return stack.push(v1 === v2 ? 1 : 0)
        }
      }

      $scope.functionDescriptors = _.mapValues($scope.functionList, (value, key) => { return {name: key} })

      if (localStorageService.get('reporting.contributionFunction') === null) {
        localStorageService.set('reporting.contributionFunction', [
          { name: 'gatheringLevel' },
          { name: 'craftingLevel' },
          { name: 'add' },
          { name: 'gatheringEffort' },
          { name: 'add' },
          { name: 'log'},
          { name: 'amount' },
          { name: 'multiply' }
        ])
      }

      $scope.functionData = {
        showFormula: false,
        list: localStorageService.get('reporting.contributionFunction')
      }

      $scope.$watch('functionData.list', () => {
        localStorageService.set('reporting.contributionFunction', $scope.functionData.list)
        $scope.updateGraph($scope.lastLog)
      }, true)

      $scope.updateGraph = function (log) {
        var groupedByUser = _.groupBy(log, function (logItem) { return logItem.submitter.name })
        var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
          return _.reduce(userLogs, function (sum, logEntry) {
            var stack = []
            if (logEntry.amount > 0) {
              _.forEach($scope.functionData.list, function (mod) {
                $scope.functionList[mod.name](logEntry, stack)
              })
            } else stack.push(0)
            return sum + (stack.length === 1 ? stack.pop() : NaN)
          }, 0)
        })
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
