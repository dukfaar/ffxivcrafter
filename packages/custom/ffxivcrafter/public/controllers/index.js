'use strict'

angular.module('mean.ffxivCrafter').controller('IndexController', ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService', 'MeanUser',
  function ($scope, Global, $http, $mdDialog, projectAnalyzerService, MeanUser) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
    }

    $scope.projectList = []
    $scope.projectData = {}

    $scope.gatherFilter = ''
    $scope.craftableFilter = ''

    $scope.deliveryDialog = function (project, item, gathers) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/project/deliveryDialog.html',
        parent: angular.element(document.body),
        controller: 'DeliveryDialogController',
        clickOutsideToClose: true,
        locals: {
          item: item,
          gathers: gathers
        }
      }).then(function (amount) {
        if (amount > 0) {
          $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + amount+'/'+(gathers.hq?'true':'false'))
            .then(function (result) {
              $scope.updateList()
            })
        }
      })
    }

    $scope.deliveryCraftDialog = function (project, item, step, craftable) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/project/deliveryCraftDialog.html',
        parent: angular.element(document.body),
        controller: 'DeliveryCraftDialogController',
        clickOutsideToClose: true,
        locals: {
          item: item,
          craftable: craftable
        }
      }).then(function (data) {
        if (data.amount > 0) {
          var stepsDone = data.amount / step.recipe.outputs[0].amount
          console.log(craftable)

          function handleInput (index) {
            if (index >= step.recipe.inputs.length) {
              $scope.updateList()
            } else {
              $http.post('/api/project/stock/add/' + project._id + '/' + step.recipe.inputs[index].item + '/' + (-stepsDone * step.recipe.inputs[index].amount)+'/'+(craftable.step.inputs[index].hq?'true':'false'))
                .then(function (result) {
                  handleInput(index + 1)
                })
            }
          }

          $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + data.amount +'/'+(craftable.step.hq?'true':'false'))
            .then(function (result) {
              if (data.craftedFromStock) {
                handleInput(0)
              } else {
                $scope.updateList()
              }
            })
        }
      })
    }

    $scope.updateList = function () {
      $http.get('api/project/public')
        .then(function (response) {
          $scope.projectList = response.data

          $scope.projectData = {}
          projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
        })
    }

    $scope.toArray = function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key]
      })
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
        ['Alchimist', 'alchimistLevel'],
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
