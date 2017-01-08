'use strict'

angular.module('mean.ffxivCrafter').controller('IndexController', ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService', 'MeanUser', 'deliveryService', 'socket', '_', 'localStorageService', 'EorzeanTimeService', '$interval', 'ProjectStep',
  function ($scope, Global, $http, $mdDialog, projectAnalyzerService, MeanUser, deliveryService, socket, _, localStorageService, EorzeanTimeService, $interval, ProjectStep) {
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

    $scope.projectList = []
    $scope.projectData = {}

    $scope.filters = {
      gatherFilter: '',
      craftableFilter: ''
    }

    //possible modes: unifiedProjects, separateProjects
    if(localStorageService.get('indexMode') == null) localStorageService.set('indexMode', 'separateProjects')
    $scope.indexMode = localStorageService.get('indexMode')

    $scope.mergeSelection=null

    $scope.oldItems = []

    var updateTimeout = null

    socket.on('project stock changed', function (data) {
      if(updateTimeout) {
        clearTimeout(updateTimeout)
      }

      updateTimeout = setTimeout(function () {
        updateTimeout = null
        $scope.updateList()
      }, 500)
    })

    var stepDateUpdateTimeout = null

    socket.on('project step data changed', function (data) {
      if(stepDateUpdateTimeout) {
        clearTimeout(stepDateUpdateTimeout)
      }

      stepDateUpdateTimeout = setTimeout(function () {
        stepDateUpdateTimeout = null
        $scope.updateList()
      }, 500)
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
          $scope.projectList = response.data

          $scope.projectData = {}
          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
        })
    }

    $scope.updateOldList = function () {
      $http.get('api/item/oldest')
        .then(function (response) {
          $scope.oldItems = response.data
        })
    }

    $scope.updateOldList()

    $scope.priceDialog = function (item) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/item/priceDialogFront.html',
        parent: angular.element(document.body),
        controller: 'ItemPriceDialogController',
        clickOutsideToClose: true,
        locals: {
          item: item,
          priceUpdate: null
        }
      }).then(function () {
        $scope.updateOldList()
      })
    }

    $scope.toArray = function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key]
      })
    }

    $scope.markStepAsWorked = function (step) {
      if(!step.workedOnBy) step.workedOnBy = []
      step.workedOnBy.push(MeanUser.user)
      ProjectStep.update({id: step._id}, step)
    }

    $scope.removeMarkStepAsWorked = function (step) {
      _.remove(step.workedOnBy,function (user) { return user._id == MeanUser.user._id })
      ProjectStep.update({id: step._id}, step)
    }

    $scope.isWorkedByMe = function(step) {
      if(!step.workedOnBy) return false
      var user = _.find(step.workedOnBy, function (user) { return user._id == MeanUser.user._id })
      if(!user) return false
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

    $scope.getGatherArray = function (project) {
      return _.filter(_.filter(_.filter($scope.toArray($scope.projectData[project._id].gatherList), $scope.gatheringFilter), $scope.canHarvest), function (g) { return g.outstanding > 0 })
    }

    $scope.getCraftArray = function (project) {
      return _.filter(_.filter($scope.toArray($scope.projectData[project._id].craftableSteps), $scope.craftingFilter), $scope.canCraft)
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
