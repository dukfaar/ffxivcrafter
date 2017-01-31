'use strict'

angular.module('mean.ffxivCrafter').directive('projectView', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/project.html',
    scope: {},
    controller: [
      '$scope', 'projectAnalyzerService', 'Project', 'socket', 'User', '_',
      'ItemDatabase', '$q', '$http', 'ProjectService', 'MeanUser',
      function (
        $scope, projectAnalyzerService, Project, socket, User, _,
        ItemDatabase, $q, $http, ProjectService, MeanUser
      ) {
        $scope.user = MeanUser
        $scope.allowed = function (perm) {
          return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
        }

        $scope.ProjectService = ProjectService
        $scope.project = {}
        $scope.projectData = {}

        $scope.users = User.query({})
        $scope.getUser = function (id) {
          return _.find($scope.users, function (u) { return u._id == id })
        }

        function recalcProjectData () {
          projectAnalyzerService.getProjectMaterialList($scope.project)
          .then(function (data) {
            $scope.projectData = data
          })
        }

        $scope.updateProject = function (p) {
          var project = $.extend(true, {}, p)
          delete project.tree
          delete project.creator
          delete project.stock
          $http.put('/api/project/' + project._id, project)
        }

        $scope.updateProjectNotes = function (project) {
          $http.put('/api/project/notes/' + project._id, {notes: project.notes})
            .then(function (response) {})
        }

        $scope.deleteProject = function () {
          Project.delete({id: $scope.project._id})
        }

        $scope.hiddenOverviewGetSet = function (value) {
          if (value === undefined) {
              // getter
            return ProjectService.isHiddenFromOverview($scope.project, MeanUser.user)
          } else {
              // setter
            if (value) {
              if (!ProjectService.isHiddenFromOverview($scope.project, MeanUser.user)) {
                $scope.project.hiddenOnOverviewBy.push(MeanUser.user._id)
                $scope.updateProject($scope.project)
              }
            } else {
              if (ProjectService.isHiddenFromOverview($scope.project, MeanUser.user)) {
                _.pull($scope.project.hiddenOnOverviewBy, MeanUser.user._id)
                $scope.updateProject($scope.project)
              }
            }
            return ProjectService.isHiddenFromOverview($scope.project, MeanUser.user)
          }
        }

        $scope.doShare = function (project, user) {
          if (!project.sharedWith) project.sharedWith = []
          if (project.sharedWith.findIndex(function (u) { return u == user._id }) === -1) {
            project.sharedWith.push(user._id)
          }

          $scope.updateProject(project)
        }

        $scope.removeShare = function (project, id) {
          if (!project.sharedWith) project.sharedWith = []
          _.pull(project.sharedWith, id)

          $scope.updateProject(project)
        }

        function getAndCalcProject (id) {
          Project.get({id: id, populate: 'tree creator'})
          .$promise.then(function (result) {
            _.forEach(result.stock, function (stockItem) {
              stockItem.item = ItemDatabase.get(stockItem.item)
            })
            $q.all(_.map(result.stock, function (stockItem) { return stockItem.item.$promise }))
            .then(function () {
              $scope.project = result
              recalcProjectData()
            })
          })
        }

        var refetchTimeout = null
        $scope.$on('projectview change project', function (event, project) {
          if($scope.project && $scope.project._id === project._id) {
            return
          }

          if (refetchTimeout) {
            clearTimeout(refetchTimeout)
            refetchTimeout = null
          }

          getAndCalcProject(project._id)
        })

        function projectChangeListener (data) {
          if ($scope.project._id === data.projectId) {
            if (refetchTimeout) clearTimeout(refetchTimeout)

            refetchTimeout = setTimeout(function () {
              refetchTimeout = null
              getAndCalcProject(data.projectId)
            }, 300)
          }
        }

        function recursiveFindSomeInInputs (step, searchId, recursion) {
          return _.some(_.map(step.inputs, function (input) {
            return recursion(input, searchId)
          }), function (v) { return v === true })
        }

        function recursiveFindStep (step, searchId) {
          if (step._id === searchId) return true

          return recursiveFindSomeInInputs(step, searchId, recursiveFindStep)
        }

        function recursiveFindItem (step, item) {
          if (step.item._id === item._id) return true

          return recursiveFindSomeInInputs(step, item, recursiveFindItem)
        }

        function changeListenerFactory (propertyName, recursion) {
          return function (data) {
            if (recursion($scope.project.tree, data[propertyName])) {
              getAndCalcProject($scope.project._id)
            }
          }
        }

        var stepChangeListener = changeListenerFactory('stepId', recursiveFindStep)
        var priceChangeListener = changeListenerFactory('item', recursiveFindItem)

        socket.on('project data changed', projectChangeListener)
        socket.on('price data changed', priceChangeListener)
        socket.on('project step data changed', stepChangeListener)
        socket.on('project stock changed', projectChangeListener)

        $scope.$on('$destroy', function () {
          socket.off('project data changed', projectChangeListener)
          socket.off('price data changed', priceChangeListener)
          socket.off('project step data changed', stepChangeListener)
          socket.off('project stock changed', projectChangeListener)
        })
      }
    ]
  }
})
