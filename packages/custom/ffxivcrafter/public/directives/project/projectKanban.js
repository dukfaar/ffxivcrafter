'use strict'

angular.module('mean.ffxivCrafter').directive('projectGrid', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/grid.html',
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
