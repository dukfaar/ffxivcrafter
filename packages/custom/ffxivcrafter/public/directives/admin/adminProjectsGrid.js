'use strict'

angular.module('mean.ffxivCrafter').directive('adminProjectsGrid', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/projectsGrid.html',
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
