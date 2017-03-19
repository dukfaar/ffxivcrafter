'use strict'

angular.module('mean.ffxivCrafter').directive('projectKanban', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/kanban.html',
    scope: {
      projectList: '='
    },
    controller: KanbanController
  }
})

KanbanController.$inject = ['$scope', '$rootScope']

function KanbanController ($scope, $rootScope) {
  $scope.makeProjectActive = makeProjectActive

  function makeProjectActive (project) {
    $rootScope.$broadcast('projectview change project', project)
  }
}
