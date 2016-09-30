'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectController', ['$scope', '$rootScope', 'Global', '$http', '$mdDialog', 'projectAnalyzerService', 'deliveryService', '$mdPanel',
  function ($scope, $rootScope, Global, $http, $mdDialog, projectAnalyzerService, deliveryService, $mdPanel) {
    $scope.projectList = []
    $scope.projectData = {}

    $scope.deliveryService = deliveryService

    $scope.tabdata = {
      selectedIndex: 0
    }

    $scope.recalcOnPage = null
    $scope.project = null

    $scope.gatherList = []
    $scope.craftableList = []
    $scope.stockList = []

    $scope.reqPanel = {

    }

    $scope.closeRequirementsPanel = function (stockElement) {
      console.log($scope.project._id+stockElement.item._id)
      console.log('closing')
      $scope.reqPanel[$scope.project._id+stockElement.item._id].close()
      .then(function() {
        $scope.reqPanel[$scope.project._id+stockElement.item._id].destroy()
        delete $scope.reqPanel[$scope.project._id+stockElement.item._id]
        $scope.reqPanel[$scope.project._id+stockElement.item._id]=null
      })
    }

    $scope.showRequirementsPanel = function (stockElement) {
      console.log($scope.project._id+stockElement.item._id)
      if (!$scope.reqPanel[$scope.project._id+stockElement.item._id]) {
        var position = $mdPanel.newPanelPosition()
          .relativeTo('#stockElement_' + stockElement.item._id)
          .addPanelPosition($mdPanel.xPosition.OFFSET_END, $mdPanel.yPosition.ALIGN_TOPS)

        var config = {
          attachTo: "#commentCard",
          controller: function ($scope, project, projectData, stockElement) {
            $scope.project = project
            $scope.projectData = projectData
            $scope.stockElement = stockElement
          },
          locals: {
            'project': $scope.project,
            'projectData': $scope.projectData,
            'stockElement': stockElement
          },
          disableParentScroll: false,
          templateUrl: 'ffxivCrafter/views/project/stockRequirementsPanel.html',
          hasBackdrop: false,
          panelClass: 'stockRequirementsPanel',
          propagateContainerEvents: true,
          position: position,
          trapFocus: false,
          zIndex: 150,
          escapeToClose: true,
          focusOnOpen: false
        }

        $scope.reqPanel[$scope.project._id+stockElement.item._id] = $mdPanel.create(config)
      }

      console.log('opening')
      $scope.reqPanel[$scope.project._id+stockElement.item._id].open()
    }

    $scope.$watch('tabdata.selectedIndex', function (oldValue, newValue) {
      if ($scope.recalcOnPage !== null && $scope.recalcOnPage !== 0) {
        $scope.tabdata.selectedIndex = $scope.recalcOnPage
        $scope.recalcOnPage = null
      }

      $scope.recalcVisibleProjectData()
    })

    $scope.$watch('project', function (oldValue, newValue) {
      if ($scope.project) {
        $scope.recalcProjectData($scope.project)

        $scope.stockList = $scope.toArray($scope.project.stock)
        $scope.craftableList = $scope.toArray($scope.projectData[$scope.project._id].craftableSteps)
        $scope.gatherList = $scope.toArray($scope.projectData[$scope.project._id].gatherList)
      }
    }, true)

    $scope.stepDeletion = { enabled: false }

    $scope.selectedProject = function (p) {
      $scope.project = p
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
        $scope.updateList()
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

    $scope.recalcProjectData = function (project) {
      if (!project) return

      $scope.projectData[project._id] = projectAnalyzerService.getProjectMaterialList(project)
    }

    $scope.recalcVisibleProjectData = function () {
      $scope.recalcProjectData($scope.projectList[$scope.tabdata.selectedIndex])
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
          $scope.tabdata.selectedIndex = 0
          $scope.updateList()
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

      $scope.projectList = $scope.projectList.filter(function (a) {return typeof a !== 'undefined';})
    }

    $scope.updateList = function () {
      var url = '/api/project'

      $http.get(url)
        .then(function (response) {
          addOrUpdateProjects(response.data)

          removeDeletedProjects(response.data)

          $scope.recalcVisibleProjectData()

          $scope.recalcOnPage = $scope.tabdata.selectedIndex

          $scope.project = $scope.projectList[$scope.tabdata.selectedIndex]
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

    $scope.updateList()
  }
])
