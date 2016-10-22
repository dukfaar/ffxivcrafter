'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectController', ['$scope', '$rootScope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService', 'deliveryService', '$mdPanel', 'socket', 'MeanUser', '$q',
  function ($scope, $rootScope, Global, $http, $mdDialog, projectAnalyzerService, deliveryService, $mdPanel, socket, MeanUser, $q) {
    $scope.tabList = []
    $scope.projectList = []
    $scope.projectData = {}

    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.deliveryService = deliveryService

    $scope.tabdata = {
      selectedIndex: 0,
      projectFilter: '',
      currentProjectName: 'project_0'
    }

    $scope.recalcOnPage = null
    $scope.project = null
    $scope.currentProjectData = null

    $scope.gatherList = []
    $scope.craftableList = []
    $scope.stockList = []

    $scope.reqPanel = {

    }

    socket.on('project stock changed', function (data) {
      $scope.getProject(data.projectId, function () {})
    })

    socket.on('new project created', function (data) {
      $scope.getProject(data.projectId, function () {})
    })

    socket.on('project data changed', function (data) {
      $scope.getProject(data.projectId, function () {})
    })

    socket.on('price data changed', function (data) {
      $scope.getProject($scope.project._id, function () {})
    })

    socket.on('project step data changed', function (data) {
      $scope.getProject($scope.project._id, function () {})
    })

    $scope.$watch('project.name', function (newValue, oldValue) {
      if ($scope.tabList[$scope.tabdata.selectedIndex]) $scope.tabList[$scope.tabdata.selectedIndex].name = newValue
    })

    $scope.$watch('currentProjectData', function (newValue, oldValue) {
      if($scope.currentProjectData) {
        if($scope.currentProjectData.craftableSteps) $scope.craftableList = $scope.toArray($scope.currentProjectData.craftableSteps)
        if($scope.currentProjectData.gatherList) $scope.gatherList = $scope.toArray($scope.currentProjectData.gatherList)
      }
    }, true)


    $scope.$watch('project', function (newValue, oldValue) {
      if ($scope.project) {
        $scope.stockList = $scope.toArray($scope.project.stock)

        $scope.recalcProjectData($scope.project)
        .then(function (data) {
          $scope.currentProjectData = data
        }, null, function (data) {
          $scope.currentProjectData = data
        })
      }
    }, true)

    $scope.stepDeletion = { enabled: false }

    $scope.clickProject = function (p, index) {
      if ($scope.project._id === p._id) return

      $scope.getProject(p._id, function () {
        $scope.project = $scope.projectList[index]
        $scope.tabdata.currentProjectName = 'project_' + index
        $scope.tabdata.selectedIndex = index
      })
    }

    $scope.showAllSteps = function () {
      $rootScope.showingAllProjectStepChildren = true
      $rootScope.$broadcast('showAllProjectStepChildren')
      setTimeout(function () {$rootScope.showingAllProjectStepChildren = false}, 2000)
    }

    $scope.hideAllSteps = function () {
      $rootScope.hidingAllProjectStepChildren = true
      $rootScope.$broadcast('hideAllProjectStepChildren')
    }

    $scope.doMerge = function (project, mergeProject) {
      $http.get('/api/project/merge/' + project._id + '/' + mergeProject._id).then(function (response) {
        $scope.updateList(function () {})
      })
    }

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
        .then(function (result) {})
    }

    $scope.setStock = function (project, item, amount, hq) {
      $http.post('/api/project/stock/set/' + project._id + '/' + item._id + '/' + amount + '/' + hq)
        .then(function (result) {})
    }

    $scope.recalcProjectData = function (project) {
      var deferred = $q.defer()

      if (!project) {
        deferred.resolve()
      } else {
        projectAnalyzerService.getProjectMaterialList(project)
        .then(function(data) {
          $scope.projectData[project._id] = data
          deferred.resolve(data)
        }, null, function(data) {
          $scope.projectData[project._id] = data
          deferred.notify(data)
        })
      }
      return deferred.promise
    }

    $scope.recalcVisibleProjectData = function () {
      return $scope.recalcProjectData($scope.project)
    }

    $scope.deliveryDialog = function (project, item, gathers) {
      deliveryService.deliveryDialog(project, item, gathers, function () { $scope.updateList() })
    }

    $scope.deliveryCraftDialog = function (project, item, step, craftable) {
      deliveryService.deliveryCraftDialog(project, item, step, craftable, function () { $scope.updateList() })
    }

    $scope.updateProject = function (p) {
      var project = $.extend(true, {}, p)
      delete project.tree
      delete project.creator
      delete project.stock
      $http.put('/api/project/' + project._id, project)
        .then(function (response) {
          $scope.recalcVisibleProjectData()
        })
    }

    $scope.updateProjectNotes = function (project) {
      $http.put('/api/project/notes/' + project._id, {notes: project.notes})
        .then(function (response) {})
    }

    $scope.deleteProject = function (project) {
      $http.delete('/api/project/' + project._id)
        .then(function (response) {
          $scope.updateList(function () {
            $scope.getProject($scope.projectList[0]._id,
              function () {
                $scope.tabdata.selectedIndex = 0
                $scope.project = $scope.projectList[0]
              })
          })
        })
    }

    $scope.updateStep = function (s) {
      var step = $.extend(true, {}, s)
      delete step.inputs
      delete step.item
      delete step.recipe
      $http.put('/api/projectstep/' + step._id, step)
        .then(function (response) {
          $scope.recalcVisibleProjectData()
        })
    }

    function addOrUpdateProject (newProject) {
      var found = false

      if ($scope.project && $scope.project._id === newProject._id) {
        $scope.project = newProject
      }

      $scope.projectList.forEach(function (oldProject, oldIndex) {
        if (newProject._id === oldProject._id) {
          $scope.projectList[oldIndex] = newProject
          $scope.projectListChanged = true
          found = true
        }
      })

      if (!found) {
        $scope.projectList.push(newProject)
        $scope.projectListChanged = true
      }
    }

    function addOrUpdateProjects (newProjects) {
      newProjects.forEach(function (newProject) {
        addOrUpdateProject(newProject)
      })
    }

    function removeDeletedProjects (newProjects) {
      var hadDeletions = false
      $scope.projectList.forEach(function (oldProject, oldIndex) {
        var found = false

        newProjects.forEach(function (newProject) {
          if (newProject._id === oldProject._id) {
            found = true
          }
        })

        if (!found) {
          hadDeletions = true
          delete $scope.projectList[oldIndex]
          $scope.projectListChanged = true
        }
      })

      if (hadDeletions) $scope.projectList = $scope.projectList.filter(function (a) {return typeof a !== 'undefined';})
    }

    $scope.updateList = function (callback) {
      $http.get('/api/project?doPopulate=false')
        .then(function (response) {
          $scope.tabList = $.extend(true, {}, response.data)
          $scope.projectList = response.data

          if (callback) callback()
        })
    }

    $scope.getProject = function (projectId, callback) {
      var url = '/api/project/' + projectId

      $http.get(url)
        .then(function (response) {
          if (response.data !== '') {
            addOrUpdateProject(response.data)

            if (callback) callback(response.data)
          }
        })
    }

    $scope.toArray = function (obj) {
      if (!obj) return []

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

      $scope.recalcVisibleProjectData()
    }

    $scope.updateList(function () {
      $scope.getProject($scope.projectList[0]._id,
        function () {
          $scope.project = $scope.projectList[0]
          $scope.tabdata.currentProjectName = 'project_0'
        })
    })
  }
])
