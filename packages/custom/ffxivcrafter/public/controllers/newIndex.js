'use strict'

angular.module('mean.ffxivCrafter').controller('NewIndexController', IndexController)

IndexController.$inject = [
  '$scope', 'deliveryService', '_', 'localStorageService',
  'CurrentEorzeanTimeService', 'EorzeanTimeService', '$interval', 'ProjectStep',
  'ProjectService', 'PublicProjectService', 'StepService', 'UserService'
]

function IndexController (
      $scope, deliveryService, _, localStorageService,
      CurrentEorzeanTimeService, EorzeanTimeService, $interval, ProjectStep,
      ProjectService, PublicProjectService, StepService, UserService
    ) {
  $scope.PublicProjectService = PublicProjectService
  $scope.UserService = UserService

  $scope.CurrentEorzeanTimeService = CurrentEorzeanTimeService
  $scope.EorzeanTimeService = EorzeanTimeService

  $scope.filters = {
    gatherCraftFilter: ''
  }

  $scope.projectFilter = function (project) {
    if(_.includes($scope.filters.gatherCraftFilter, '#private')) {
      return project.private
    }

    return true
  }

    // possible modes: unifiedProjects, separateProjects
  if (localStorageService.get('indexMode') == null) localStorageService.set('indexMode', 'separateProjects')
  $scope.indexMode = localStorageService.get('indexMode')

  if (localStorageService.get('unspoiledTimeline') == null) localStorageService.set('unspoiledTimeline', false)
  $scope.showUnspoiledTimelime = localStorageService.get('unspoiledTimeline')

  $scope.mergeSelection = null

  $scope.deliveryDialog = function (project, item, gathers) {
    deliveryService.deliveryDialog(project, item, gathers, function () {
      $scope.removeMarkStepAsWorked(gathers.step)
          // $scope.updateList()
    })
  }

  $scope.deliveryCraftDialog = function (project, item, step, craftable) {
    deliveryService.deliveryCraftDialog(project, item, step, craftable, function () {
      $scope.removeMarkStepAsWorked(step.step)
          // $scope.updateList()
    })
  }

  $scope.toArray = function (obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key]
    })
  }

  $scope.markStepAsWorked = function (step) {
    if (!step.workedOnBy) step.workedOnBy = []
    step.workedOnBy.push(UserService.user)
    ProjectStep.update({id: step._id}, {workedOnBy: step.workedOnBy})
  }

  $scope.removeMarkStepAsWorked = function (step) {
    if ($scope.isWorkedByMe(step)) {
      _.remove(step.workedOnBy, function (user) { return user._id === UserService.user._id })
      ProjectStep.update({id: step._id}, {workedOnBy: step.workedOnBy})
    }
  }

  $scope.isWorkedByMe = function (step) {
    if (!step.workedOnBy) return false
    var user = _.find(step.workedOnBy, function (user) { return user._id === UserService.user._id })
    if (!user) return false
    return true
  }

  $scope.gatheringFilter = function (step) {
    var filter = _.lowerCase(_.replace($scope.filters.gatherCraftFilter, '#private', ''))
    return _.lowerCase(step.item.name).indexOf(filter) !== -1 || _.lowerCase(step.item.gatheringJob).indexOf(filter) !== -1
  }

  $scope.craftingFilter = function (step) {
    var filter = _.lowerCase(_.replace($scope.filters.gatherCraftFilter, '#private', ''))
    return _.lowerCase(step.step.item.name).indexOf(filter) !== -1 || _.lowerCase(step.step.recipe.craftingJob).indexOf(filter) !== -1
  }

  $scope.getGatherArrayFromProjectData = function (project, projectData) {
    return _.filter(_.filter(_.filter($scope.toArray(projectData[project._id].gatherList), $scope.gatheringFilter), StepService.canHarvest), function (g) { return g.outstanding > 0 })
  }

  $scope.getCraftArrayFromProjectData = function (project, projectData) {
    return _.filter(_.filter(_.filter($scope.toArray(projectData[project._id].craftableSteps), $scope.craftingFilter), StepService.canCraft), function (g) { return Math.floor(g.step.amount) > 0 })
  }

  $scope.getGatherArray = function (project) {
    return $scope.getGatherArrayFromProjectData(project, PublicProjectService.projectData)
  }

  $scope.getCraftArray = function (project) {
    return $scope.getCraftArrayFromProjectData(project, PublicProjectService.projectData)
  }
}
