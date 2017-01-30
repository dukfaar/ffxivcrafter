'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectViewService',
  [ 'socket', 'localStorageService', '$q',
    function (socket, localStorageService, $q) {
      return {
        initViewScope: function ($scope, queryFunction) {
          $scope.tabdata = {
            showProjectOverview: true,
            useOverview: localStorageService.get('useProjectOverview')
          }

          $scope.$on('projectview change project', function (event, project) {
            $scope.tabdata.showProjectOverview = false
          })

          $scope.queryProjectList = function () {
            var projectList = queryFunction()

            if (projectList.$promise) {
              $scope.tabdata.projectList = projectList
              $scope.tabdata.projectList.$promise.then(function () {
                $scope.$broadcast('projectList changed', $scope.tabdata.projectList)
              })
            } else {
              $q.all(_.map(projectList, function (p) { return p.$promise })).then(function (result) {
                $scope.tabdata.projectList = _.uniq(_.flatten(result), '_id')
                $scope.$broadcast('projectList changed', $scope.tabdata.projectList)
              })
            }
          }

          $scope.projectListChangeListener = function (data) {
            $scope.queryProjectList()
          }

          socket.on('new project created', $scope.projectListChangeListener)
          socket.on('CraftingProject deleted', $scope.projectListChangeListener)

          $scope.$on('$destroy', function () {
            socket.off('new project created', $scope.projectListChangeListener)
            socket.off('CraftingProject deleted', $scope.projectListChangeListener)
          })
        }
      }
    }
  ]
)
