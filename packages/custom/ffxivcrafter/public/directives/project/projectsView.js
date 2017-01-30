'use strict'

angular.module('mean.ffxivCrafter').directive('projectsView', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/view.html',
    controller: [
      '$scope', 'projectAnalyzerService', 'Project', 'User',
      'localStorageService', '_', 'MeanUser', 'socket', '$stateParams',
      function (
        $scope, projectAnalyzerService, Project, User,
        localStorageService, _, MeanUser, socket, $stateParams
      ) {
        Project.get({id: $stateParams.projectId}).$promise.then(function (project) {
          $scope.$broadcast('projectview change project', project)
        })
      }
    ]
  }
})
