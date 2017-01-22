'use strict'

angular.module('mean.ffxivCrafter').controller('IndexController',
  ['$scope', 'MeanUser', 'deliveryService', '_', 'localStorageService',
    'EorzeanTimeService', '$interval', 'ProjectStep',
    'ProjectService', 'PublicProjectService', 'StepService',
    function (
      $scope, MeanUser, deliveryService, _, localStorageService,
      EorzeanTimeService, $interval, ProjectStep,
      ProjectService, PublicProjectService, StepService) {
      $scope.PublicProjectService = PublicProjectService
      $scope.user = MeanUser
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
      }

      $scope.EorzeanTimeService = EorzeanTimeService

      $scope.currentEorzeanTime = EorzeanTimeService.getEorzeanTime()
      var timeInterval = $interval(function () {
        $scope.currentEorzeanTime = EorzeanTimeService.getEorzeanTime()
      }, 1000)

      $scope.$on('$destroy', function () {
        $interval.cancel(timeInterval)
      })

      $scope.filters = {
        gatherFilter: '',
        craftableFilter: ''
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
        step.workedOnBy.push(MeanUser.user)
        ProjectStep.update({id: step._id}, step)
      }

      $scope.removeMarkStepAsWorked = function (step) {
        _.remove(step.workedOnBy, function (user) { return user._id === MeanUser.user._id })
        ProjectStep.update({id: step._id}, step)
      }

      $scope.isWorkedByMe = function (step) {
        if (!step.workedOnBy) return false
        var user = _.find(step.workedOnBy, function (user) { return user._id === MeanUser.user._id })
        if (!user) return false
        return true
      }

      $scope.gatheringFilter = function (step) {
        var filter = _.lowerCase($scope.filters.gatherFilter)
        return _.lowerCase(step.item.name).indexOf(filter) !== -1 || _.lowerCase(step.item.gatheringJob).indexOf(filter) !== -1
      }

      $scope.craftingFilter = function (step) {
        var filter = _.lowerCase($scope.filters.craftableFilter)
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
  ])
