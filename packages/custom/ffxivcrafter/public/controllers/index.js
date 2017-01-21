'use strict'

angular.module('mean.ffxivCrafter').controller('IndexController',
  ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService',
    'MeanUser', 'deliveryService', 'socket', '_', 'localStorageService',
    'EorzeanTimeService', '$interval', 'ProjectStep',
    'ItemDatabase', 'ProjectDatabase', '$q', 'ProjectService', 'webNotification',
    '$translate', 'NotificationSettingsService',
    function (
    $scope, Global, $http, $mdDialog, projectAnalyzerService,
    MeanUser, deliveryService, socket, _, localStorageService,
    EorzeanTimeService, $interval, ProjectStep,
    ItemDatabase, ProjectDatabase, $q, ProjectService, webNotification,
    $translate, NotificationSettingsService) {
      $scope.user = MeanUser
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
      }

      $scope.EorzeanTimeService = EorzeanTimeService

      $scope.currentEorzeanTime = EorzeanTimeService.getEorzeanTime()
      var timeInterval = $interval(function () {
        $scope.currentEorzeanTime = EorzeanTimeService.getEorzeanTime()
      }, 1000)

      $scope.projectList = []
      $scope.projectData = {}

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

      var updateTimeout = null
      function projectStockChangeListener (ev, data) {
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }

        updateTimeout = setTimeout(function () {
          updateTimeout = null
          $scope.updateList()
        }, 500)
      }

      var stepDateUpdateTimeout = null
      function projectStepDataChangeListener (ev, data) {
        if (stepDateUpdateTimeout) {
          clearTimeout(stepDateUpdateTimeout)
        }

        stepDateUpdateTimeout = setTimeout(function () {
          stepDateUpdateTimeout = null
          $scope.updateList()
        }, 500)
      }

      socket.on('project stock changed', projectStockChangeListener)
      socket.on('project step data changed', projectStepDataChangeListener)

      $scope.$on('$destroy', function () {
        $interval.cancel(timeInterval)

        socket.off('project stock changed', projectStockChangeListener)
        socket.off('project step data changed', projectStepDataChangeListener)
      })

      $scope.deliveryDialog = function (project, item, gathers) {
        deliveryService.deliveryDialog(project, item, gathers, function () { $scope.updateList() })
      }

      $scope.deliveryCraftDialog = function (project, item, step, craftable) {
        deliveryService.deliveryCraftDialog(project, item, step, craftable, function () { $scope.updateList() })
      }

      $scope.updateList = function () {
        $http.get('api/project/public')
        .then(function (response) {
          $scope.projectList = _.reject(response.data, function (p) { return ProjectService.isHiddenFromOverview(p, MeanUser.user) })

          var oldProjectData = _.extend({}, $scope.projectData, true)

          $scope.projectData = {}
          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
          .then(function () {
            if(NotificationSettingsService.enabled.craftable && !_.isEmpty(oldProjectData)) {
              _.forEach($scope.projectList, function (project) {
                var newCraftArray = $scope.getCraftArray(project)
                var oldCraftArray = $scope.getCraftArrayFromProjectData(project, oldProjectData)

                _.forEach(newCraftArray, function (newCraft) {
                  var oldCraft = _.find(oldCraftArray, function (c) { return newCraft.step.step._id === c.step.step._id })

                  if(!oldCraft) {
                    if(Math.floor(newCraft.step.amount) > 0) {
                      $translate('notification.craftable.new', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount)}).then(function (notificationText) {
                        webNotification.showNotification('New craftable items', {
                          body: notificationText,
                          autoClose: 10000
                        })
                      })
                    }
                  } else {
                    if(Math.floor(newCraft.step.amount) > Math.floor(oldCraft.step.amount)) {
                      $translate('notification.craftable.more', {project: project.name, item: newCraft.step.item.name, amount: Math.floor(newCraft.step.amount) - Math.floor(oldCraft.step.amount)}).then(function (notificationText) {
                        webNotification.showNotification('More craftable items', {
                          body: notificationText,
                          autoClose: 10000
                        })
                      })
                    }
                  }
                })
              })
            }
          })
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
        _.remove(step.workedOnBy, function (user) { return user._id == MeanUser.user._id })
        ProjectStep.update({id: step._id}, step)
      }

      $scope.isWorkedByMe = function (step) {
        if (!step.workedOnBy) return false
        var user = _.find(step.workedOnBy, function (user) { return user._id == MeanUser.user._id })
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
        return _.filter(_.filter(_.filter($scope.toArray(projectData[project._id].gatherList), $scope.gatheringFilter), $scope.canHarvest), function (g) { return g.outstanding > 0 })
      }

      $scope.getCraftArrayFromProjectData = function (project, projectData) {
        return _.filter(_.filter(_.filter($scope.toArray(projectData[project._id].craftableSteps), $scope.craftingFilter), $scope.canCraft), function (g) { return Math.floor(g.step.amount) > 0 })
      }

      $scope.getGatherArray = function (project) {
        return $scope.getGatherArrayFromProjectData(project, $scope.projectData)
      }

      $scope.getCraftArray = function (project) {
        return $scope.getCraftArrayFromProjectData(project, $scope.projectData)
      }

      $scope.canHarvest = function (step) {
        var map = [['Miner', 'minerLevel'], ['Botanist', 'botanistLevel']]

        for (var i in map) {
          var job = map[i]
          if (step.item.gatheringJob === 'None') {
            return true
          } else if (step.item.gatheringJob === job[0]) {
            return step.item.gatheringLevel <= MeanUser.user[job[1]]
          }
        }

        return false
      }

      $scope.canCraft = function (step) {
        var map = [
        ['Weaver', 'weaverLevel'],
        ['Culinarian', 'culinarianLevel'],
        ['Alchemist', 'alchimistLevel'],
        ['Blacksmith', 'blacksmithLevel'],
        ['Carpenter', 'carpenterLevel'],
        ['Armorer', 'armorerLevel'],
        ['Goldsmith', 'goldsmithLevel'],
        ['Leatherworker', 'leatherworkerLevel']
        ]

        for (var i in map) {
          var job = map[i]

          if (step.step.recipe.craftingJob === job[0]) {
            return step.step.recipe.craftingLevel <= MeanUser.user[job[1]]
          }
        }

        return false
      }

      $scope.updateList()
    }
  ])
