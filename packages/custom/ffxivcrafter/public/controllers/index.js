'use strict'

angular.module('mean.ffxivCrafter').controller('IndexController', ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService', 'MeanUser', 'deliveryService', 'socket', '_', 'localStorageService',
  function ($scope, Global, $http, $mdDialog, projectAnalyzerService, MeanUser, deliveryService, socket, _, localStorageService) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

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
      if(updateTimeout) clearTimeout(updateTimeout)
      updateTimeout = setTimeout(function () {
        updateTimeout = null
        $scope.updateList()
      }, 200)
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

    socket.on('project stock changed', function (data) {
      $scope.updateList()
    })
  }
])
