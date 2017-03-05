'use strict'

angular.module('mean.ffxivCrafter').directive('adminProjects', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/projects.html',
    controller: [
      '$scope', 'projectAnalyzerService', 'Project', 'User',
      'localStorageService', '_', 'MeanUser', 'socket', 'ProjectViewService',
      function (
        $scope, projectAnalyzerService, Project, User,
        localStorageService, _, MeanUser, socket, ProjectViewService
      ) {
        ProjectViewService.initViewScope($scope, function () {
          return Project.query({populate: 'creator'})
        })

        $scope.queryProjectList()
      }
    ]
  }
})
