'use strict'

angular.module('mean.ffxivCrafter').directive('projectsPrivate', function () {
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
          return [
            Project.query({private: true, creator: MeanUser.user._id, populate: 'creator'}),
            Project.query({sharedWith: MeanUser.user._id, populate: 'creator'})
          ]
        })

        $scope.queryProjectList()
      }
    ]
  }
})
