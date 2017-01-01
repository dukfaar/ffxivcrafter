'use strict'

angular.module('mean.ffxivCrafter').directive('projectManagerOverview', function () {
  return {
    templateUrl: '/ffxivCrafter/views/projectManager/overview.html',
    controller: function ($scope, Global, $http, $timeout, $q, _, Project) {
      $scope.allProjects = Project.query({})
      $scope.orderProjects = []
      $scope.publicProjects = []

      $scope.allProjects.$promise.then(function () {
        $scope.orderProjects = _.filter($scope.allProjects, function (project) { return project.order })
        $scope.publicProjects = _.filter($scope.allProjects, function (project) { return project.public && !project.private })
      })
    }
  }
})
