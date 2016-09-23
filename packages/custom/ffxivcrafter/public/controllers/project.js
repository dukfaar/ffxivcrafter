'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectController', ['$scope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService',
  function ($scope, Global, $http, $mdDialog, projectAnalyzerService) {
    $scope.projectList = []
    $scope.projectData = {}

    $scope.tabdata = {
      selectedIndex: 0
    }

    $scope.recalcOnPage = null

    $scope.$watch('tabdata.selectedIndex',function(oldValue,newValue) {
      if($scope.recalcOnPage!==null&&$scope.recalcOnPage!==0) {
        $scope.tabdata.selectedIndex = $scope.recalcOnPage
        $scope.recalcOnPage=null
      }
    })

    $scope.gatherFilter = ''
    $scope.gatherTotalFilter = ''
    $scope.craftableFilter = ''
    $scope.stockFilter = ''

    $scope.projectAnalyzerService = projectAnalyzerService

    $scope.isGatherOutsanding = function (gather) {
      return gather.outstanding > 0
    }

    $scope.addToStock = function (project, item, amount, hq) {
      $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + amount + '/' + hq)
        .then(function (result) {
          $scope.updateList()
        })
    }

    $scope.setStock = function (project, item, amount, hq) {
      $http.post('/api/project/stock/set/' + project._id + '/' + item._id + '/' + amount + '/' + hq)
        .then(function (result) {
          $scope.updateList()
        })
    }

    $scope.recalcProjectData = function () {
      $scope.projectData = {}
      projectAnalyzerService.updateMaterialList($scope.projectList, $scope.projectData)
    }

    $scope.updateProject = function (project) {
      $http.put('/api/project/' + project._id, project)
        .then(function (response) {
          $scope.recalcProjectData()
        })
    }

    $scope.deleteProject = function (project) {
      $http.delete('/api/project/' + project._id)
        .then(function (response) {
          $scope.tabdata.selectedIndex=0
          $scope.updateList()
        })
    }

    $scope.updateStep = function (step) {
      $http.put('/api/projectstep/' + step._id, step)
        .then(function (response) {
          $scope.recalcProjectData()
        })
    }

    function addOrUpdateProjects (newProjects) {
      newProjects.forEach(function (newProject) {
        var found = false

        $scope.projectList.forEach(function (oldProject, oldIndex) {
          if (newProject._id === oldProject._id) {
            $scope.projectList[oldIndex] = newProject
            found = true
          }
        })

        if (!found) {
          $scope.projectList.push(newProject)
        }
      })
    }

    function removeDeletedProjects (newProjects) {
      $scope.projectList.forEach(function (oldProject, oldIndex) {
        var found = false

        newProjects.forEach(function (newProject) {
          if (newProject._id === oldProject._id) {
            found = true
          }
        })

        if (!found) {
          delete $scope.projectList[oldIndex]
        }
      })

      $scope.projectList=$scope.projectList.filter(function (a) {return typeof a !== 'undefined';}
      )
    }

    $scope.updateList = function () {
      var url = '/api/project'

      $http.get(url)
        .then(function (response) {
          addOrUpdateProjects(response.data)

          removeDeletedProjects(response.data)

          $scope.recalcProjectData()

          $scope.recalcOnPage=$scope.tabdata.selectedIndex
        })
    }

    $scope.createProject = function () {
      $http.post('/api/project')
        .then(function (response) {
          $scope.updateList()
        })
    }

    $scope.toArray = function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key]
      })
    }

    function recursiveSetPrices (step, item) {
      if (step.item._id === item._id) {
        step.item = item
      }

      step.inputs.forEach(function (input) {
        recursiveSetPrices(input, item)
      })
    }

    $scope.priceUpdate = function (item) {
      $scope.projectList.forEach(function (project) {
        recursiveSetPrices(project.tree, item)
      })

      $scope.recalcProjectData()
    }

    $scope.updateList()
  }
])
