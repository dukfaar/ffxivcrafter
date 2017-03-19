'use strict'

angular.module('mean.ffxivCrafter').directive('projectGrid', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/grid.html',
    scope: {
      projectList: '='
    },
    controller: GridController
  }
})

GridController.$inject = ['$scope', '$rootScope']

function GridController ($scope, $rootScope) {
  $scope.makeProjectActive = makeProjectActive

  function makeProjectActive (project) {
    $rootScope.$broadcast('projectview change project', project)
  }
}
