'use strict'

angular.module('mean.ffxivCrafter').directive('revenueCard', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/revenueCard.html',
    scope: {
      project: '=',
      projectData: '='
    },
    controller: function ($scope, projectAnalyzerService) {
      $scope.projectAnalyzerService = projectAnalyzerService
    }
  }
})
