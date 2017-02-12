'use strict'

angular.module('mean.ffxivCrafter').directive('reportingUserContributionChart', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/userContributionChart.html',
    scope: {
    },
    controller: function ($scope, _, localStorageService, CPU) {
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

      var defaultCode = ';check if amount is positive\ncmp amount #0\njmp lte exit0 #0\n\n;check if entry is not to be ignored\ncmp dontUseForContribution #1\njmp eq exit0 #0\n\n;calculate contribution\nset contribution #0\nadd contribution gatheringLevel\nadd contribution gatheringEffort\nadd contribution craftingLevel\nlog contribution\nmul contribution amount\nexit\n\n@ exit0\nset contribution #0\nexit'

      if (!localStorageService.get('reporting.contributionFunction')) {
        localStorageService.set('reporting.contributionFunction', defaultCode)
      }

      var cpu = new CPU.CPU()

      $scope.functionData = {
        showCode: false,
        code: localStorageService.get('reporting.contributionCode')
      }
      $scope.functionData.compiledCode = CPU.compile($scope.functionData.code)

      $scope.setDefaultCode = function () {
        $scope.functionData.code = defaultCode
      }

      $scope.$watch('functionData.code', function () {
        localStorageService.set('reporting.contributionCode', $scope.functionData.code)
        $scope.functionData.compiledCode = CPU.compile($scope.functionData.code)
        $scope.updateGraph($scope.lastLog)
      })

      $scope.updateGraph = function (log) {
        var groupedByUser = _.groupBy(log, function (logItem) { return logItem.submitter.name })
        var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
          return _.reduce(userLogs, function (sum, logEntry) {
            cpu.memory.gatheringLevel = logEntry.item.gatheringLevel
            cpu.memory.craftingLevel = logEntry.recipe ? logEntry.recipe.craftingLevel : 0
            cpu.memory.stars = logEntry.recipe ? logEntry.recipe.stars : 0
            cpu.memory.requiredControl = logEntry.recipe ? logEntry.recipe.requiredControl : 0
            cpu.memory.requiredCraftsmanship = logEntry.recipe ? logEntry.recipe.requiredCraftsmanship : 0
            cpu.memory.masterbook = logEntry.recipe ? logEntry.recipe.masterbook : 0
            cpu.memory.gatheringEffort = logEntry.item.gatheringEffort
            cpu.memory.dontUseForContribution = logEntry.dontUseForContribution ? 1 : 0
            cpu.memory.amount = logEntry.amount

            cpu.execute($scope.functionData.compiledCode)

            return sum + Number.parseFloat(cpu.memory.contribution)
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
