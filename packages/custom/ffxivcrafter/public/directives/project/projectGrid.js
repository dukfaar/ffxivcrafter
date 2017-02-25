'use strict'

angular.module('mean.ffxivCrafter').directive('projectKanban', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/kanban.html',
    scope: {
      projectList: '='
    },
    controller: [
      '$scope', '$rootScope',
      function (
        $scope, $rootScope
      ) {
        $scope.makeProjectActive = function (project) {
          $rootScope.$broadcast('projectview change project', project)
        }
      }
    ]
  }
})
