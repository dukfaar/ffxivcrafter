'use strict'

angular.module('mean.ffxivCrafter').factory('ContributionService', ContributionService)

ContributionService.$inject = ['_', 'localStorageService', 'CPU']

function ContributionService(_, localStorageService, CPU) {
  var defaultCode = ';check if amount is positive\ncmp amount #0\njmp lte exit0 #0\n\n;check if entry is not to be ignored\ncmp dontUseForContribution #1\njmp eq exit0 #0\n\n;calculate contribution\nset contribution #0\nadd contribution gatheringLevel\nadd contribution gatheringEffort\nadd contribution craftingLevel\nlog contribution\nmul contribution amount\nexit\n\n@ exit0\nset contribution #0\nexit'

  if (!localStorageService.get('reporting.contributionFunction')) {
    localStorageService.set('reporting.contributionFunction', defaultCode)
  }

  var cpu = new CPU.CPU()

  var data = {
  }

  function getAndCompileCode () {
    data.code = localStorageService.get('reporting.contributionCode')
    data.compiledCode = CPU.compile(data.code)
  }

  function setAndCompileCode () {
    localStorageService.set('reporting.contributionCode', data.code)
    data.compiledCode = CPU.compile(data.code)
  }

  function setDefaultCode () {
    data.code = defaultCode
    setAndCompileCode()
  }

  var craftMap = {
    'Weaver': 'weaver',
    'Culinarian': 'culinarian',
    'Alchemist': 'alchimist',
    'Blacksmith': 'blacksmith',
    'Carpenter': 'carpenter',
    'Armorer': 'armorer',
    'Goldsmith': 'goldsmith',
    'Leatherworker': 'leatherworker'
  }

  var gatherMap = {'Miner': 'miner', 'Botanist': 'botanist'}

  function setUserJobLevel (logEntry) {
    if(logEntry.recipe) {
      cpu.memory.userJobLevel = logEntry.submitter[craftMap[logEntry.recipe.craftingJob] + 'Level']
    } else if(gatherMap[logEntry.item.gatheringJob]) {
      cpu.memory.userJobLevel = logEntry.submitter[gatherMap[logEntry.item.gatheringJob] + 'Level']
    } else {
      cpu.memory.userJobLevel = 0
    }
  }

  function setUnspoiledNodeData (logEntry) {
    cpu.memory.isUnspoiledNode = logEntry.item.unspoiledNode ? 1 : 0
    if(logEntry.item.unspoiledNode) {
      cpu.memory.unspoiledTime = logEntry.item.unspoiledNodeTime.time
      cpu.memory.unspoiledDuration = logEntry.item.unspoiledNodeTime.duration
      cpu.memory.unspoiledAmPm = logEntry.item.unspoiledNodeTime.ampm
      cpu.memory.unspoiledFolklore = logEntry.item.unspoiledNodeTime.folkloreNeeded != '' ? 1 : 0
    } else {
      cpu.memory.unspoiledTime = 0
      cpu.memory.unspoiledDuration = 0
      cpu.memory.unspoiledAmPm = 0
      cpu.memory.unspoiledFolklore = 0
    }
  }

  function processLog(log) {
    var groupedByUser = _.groupBy(log, function (logItem) { return logItem.submitter.name })
    var countedByUser = _.mapValues(groupedByUser, function (userLogs) {
      return _.reduce(userLogs, function (sum, logEntry) {
        cpu.memory.gatheringLevel = logEntry.item.gatheringLevel ? logEntry.item.gatheringLevel : 0
        cpu.memory.craftingLevel = logEntry.recipe ? logEntry.recipe.craftingLevel : 0

        setUserJobLevel(logEntry)

        setUnspoiledNodeData(logEntry)

        cpu.memory.stars = logEntry.recipe ? logEntry.recipe.stars : 0
        cpu.memory.requiredControl = logEntry.recipe ? logEntry.recipe.requiredControl : 0
        cpu.memory.requiredCraftsmanship = logEntry.recipe ? logEntry.recipe.requiredCraftsmanship : 0
        cpu.memory.masterbook = logEntry.recipe ? logEntry.recipe.masterbook : 0
        cpu.memory.gatheringEffort = logEntry.item.gatheringEffort
        cpu.memory.dontUseForContribution = logEntry.dontUseForContribution ? 1 : 0
        cpu.memory.amount = logEntry.amount

        cpu.execute(data.compiledCode)

        return sum + Number.parseFloat(cpu.memory.contribution)
      }, 0)
    })

    return countedByUser
  }

  getAndCompileCode()

  return {
    data: data,
    setAndCompileCode: setAndCompileCode,
    processLog: processLog,
    setDefaultCode: setDefaultCode
  }
}
