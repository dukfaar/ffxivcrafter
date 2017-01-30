'use strict'

angular.module('mean.ffxivCrafter').directive('projectTabs', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/tabs.html',
    scope: {
      projectList: '=',
      initializing: '='
    },
    controller: [
      '$scope', '$rootScope', '_',
      function (
        $scope, $rootScope, _
      ) {
        $scope.tabdata = {
          selectedIndex: 0,
          indexCopy: 0,
          initializing: $scope.initializing
        }

        $scope.$on('projectview change project', function (event, project) {
          $scope.tabdata.selectedIndex = _.findIndex($scope.projectList, function (tabProject) { return project._id === tabProject._id })
          $scope.tabdata.indexCopy = $scope.tabdata.selectedIndex
        })

        $scope.$on('projectList changed', function (event, data) {
          if (data && $scope.tabdata.indexCopy >= data.length) {
            $scope.tabdata.selectedIndex = data.length - 1
            $scope.tabdata.indexCopy = $scope.tabdata.selectedIndex
          }

          if (!$scope.tabdata.initializing) $scope.makeProjectActive(data[$scope.tabdata.selectedIndex])
          $scope.tabdata.initializing = false
        })

        $scope.makeProjectActive = function (project) {
          $rootScope.$broadcast('projectview change project', project)

          $scope.tabdata.indexCopy = $scope.tabdata.selectedIndex
        }
      }
    ]
  }
})
