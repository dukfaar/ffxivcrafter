'use strict'

angular.module('mean.ffxivCrafter').directive('projectsOrder', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/private.html',
    controller: [
      '$scope', 'projectAnalyzerService', 'Project', 'User',
      'localStorageService', '_', 'MeanUser', 'socket', 'ProjectViewService',
      function (
        $scope, projectAnalyzerService, Project, User,
        localStorageService, _, MeanUser, socket, ProjectViewService
      ) {
        ProjectViewService.initViewScope($scope, function () {
          return Project.query({order: true, populate: 'creator'})
        })

        $scope.queryProjectList()
      }
    ]
  }
})
