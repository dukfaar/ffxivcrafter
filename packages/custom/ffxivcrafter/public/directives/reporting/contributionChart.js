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

      var CPU = function () {
        this.memory = {}
        this.flags = {
          eq: false,
          gt: false,
          lt: false
        }

        this.getValue = function (arg) {
          if (_.startsWith(arg, '#')) {
            return _.slice(arg, 1)
          } else {
            return this.memory[arg]
          }
        }

        this.instructions = {
          set: ([a0, a1]) => { this.memory[a0] = this.getValue(a1) },
          add: ([a0, a1]) => { this.memory[a0] = Number.parseFloat(this.getValue(a0)) + Number.parseFloat(this.getValue(a1)) },
          sub: ([a0, a1]) => { this.memory[a0] = Number.parseFloat(this.getValue(a0)) - Number.parseFloat(this.getValue(a1)) },
          mul: ([a0, a1]) => { this.memory[a0] = Number.parseFloat(this.getValue(a0)) * Number.parseFloat(this.getValue(a1)) },
          div: ([a0, a1]) => { this.memory[a0] = Number.parseFloat(this.getValue(a0)) / Number.parseFloat(this.getValue(a1)) },
          log: ([a0]) => { this.memory[a0] = Math.log(Number.parseFloat(this.getValue(a0))) },
          ceil: ([a0]) => { this.memory[a0] = Math.ceil(Number.parseFloat(this.getValue(a0))) },
          floor: ([a0]) => { this.memory[a0] = Math.floor(Number.parseFloat(this.getValue(a0))) },
          exit: (args) => { this.memory.pc = -1 },
          cmp: ([a0, a1]) => {
            this.flags.eq = Number.parseFloat(this.getValue(a0)) === Number.parseFloat(this.getValue(a1))
            this.flags.gt = Number.parseFloat(this.getValue(a0)) >= Number.parseFloat(this.getValue(a1))
            this.flags.lt = Number.parseFloat(this.getValue(a0)) <= Number.parseFloat(this.getValue(a1))
          },
          '@': (args) => {},
          jmp: ([cond, a0, a1]) => {
            if (
              (cond === 'eq' && !this.flags.eq) ||
              (cond === 'neq' && this.flags.eq) ||
              (cond === 'gt' && !this.flags.gt) ||
              (cond === 'lt' && !this.flags.lt) ||
              (cond === 'gte' && !this.flags.eq && !this.flags.gt) ||
              (cond === 'lte' && !this.flags.eq && !this.flags.lt)
            ) return

            this.memory.pc = Number.parseInt(this.getValue(a0)) + Number.parseInt(this.getValue(a1))
          }
        }

        this.executeInstruction = function (i) {
          this.instructions[i.instructionName].bind(this)(i.args)
        }

        this.fetchInstruction = function (code) {
          var i = code[this.memory.pc]
          this.memory.pc ++
          return i
        }

        this.parseLabels = function (code) {
          this.memory.pc = 0

          while (this.memory.pc >= 0 && this.memory.pc < code.length) {
            var i = this.fetchInstruction(code)
            if (i.instructionName === '@') {
              this.memory[i.args[0]] = this.memory.pc
            }
          }
        }

        this.execute = function (code) {
          this.parseLabels(code)

          this.memory.pc = 0

          while (this.memory.pc >= 0 && this.memory.pc < code.length) {
            var i = this.fetchInstruction(code)
            this.executeInstruction(i)
          }
        }

        this.compile = function (code) {
          var lines = _.split(code, '\n')
          lines = _.reject(lines, (line) => { return _.trim(line).length === 0 })
          lines = _.reject(lines, (line) => { return _.startsWith(_.trim(line), ';') })
          return _.map(lines, (line) => {
            var splitted = _.split(_.trim(line), /\s+/)
            return { instructionName: _.trim(_.head(splitted)), args: _.map(_.tail(splitted), (arg) => { return _.trim(arg) }) }
          })
        }
      }

      var defaultCode = ';check if amount is positive\ncmp amount #0\njmp lte exit0 #0\n\n;check if entry is not to be ignored\ncmp dontUseForContribution #1\njmp eq exit0 #0\n\n;calculate contribution\nset contribution #0\nadd contribution gatheringLevel\nadd contribution gatheringEffort\nadd contribution craftingLevel\nlog contribution\nmul contribution amount\nexit\n\n@ exit0\nset contribution #0\nexit'

      if (!localStorageService.get('reporting.contributionFunction')) {
        localStorageService.set('reporting.contributionFunction', defaultCode)
      }

      var cpu = new CPU()

      $scope.functionData = {
        showCode: false,
        code: localStorageService.get('reporting.contributionCode')
      }
      $scope.functionData.compiledCode = cpu.compile($scope.functionData.code)

      $scope.setDefaultCode = function () {
        $scope.functionData.code = defaultCode
      }

      $scope.$watch('functionData.code', function () {
        localStorageService.set('reporting.contributionCode', $scope.functionData.code)
        $scope.functionData.compiledCode = cpu.compile($scope.functionData.code)
        $scope.updateGraph($scope.lastLog)
      })

      $scope.updateGraph = function (log) {
        var groupedByUser = _.groupBy(log, function (logItem) { return logItem.submitter.name })
        var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
          return _.reduce(userLogs, function (sum, logEntry) {
            cpu.memory.gatheringLevel = logEntry.item.gatheringLevel
            cpu.memory.craftingLevel = logEntry.recipe ? logEntry.recipe.craftingLevel : 0
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
