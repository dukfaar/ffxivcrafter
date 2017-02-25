'use strict'

angular.module('mean.ffxivCrafter').directive('projectsPublic', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/public.html',
    controller: [
      '$scope', 'projectAnalyzerService', 'Project', 'User',
      'localStorageService', '_', 'MeanUser', 'socket', 'ProjectViewService',
      function (
        $scope, projectAnalyzerService, Project, User,
        localStorageService, _, MeanUser, socket, ProjectViewService
      ) {
        ProjectViewService.initViewScope($scope, function () {
          return Project.query({private: false, populate: 'creator'})
        })

        $scope.queryProjectList()
      }
    ]
  }
})
