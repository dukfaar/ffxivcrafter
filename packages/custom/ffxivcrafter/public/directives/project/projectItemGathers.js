'use strict'

angular.module('mean.ffxivCrafter').directive('projectItemGathers', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/itemGathers.html',
    scope: {
      project: '=',
      projectData : '='
    },
    controller: function ($scope, $http, deliveryService, StockService) {
      $scope.gatherFilter = ''
      $scope.addToStock = StockService.addToStock

      $scope.$watch('projectData.gatherList', function() {
        $scope.gatherList = $scope.projectData && $scope.projectData.gatherList ? Object.keys($scope.projectData.gatherList).map(function (key) { return $scope.projectData.gatherList[key] }) : []
      }, true)

      $scope.deliveryDialog = function (project, item, gathers) {
        deliveryService.deliveryDialog(project, item, gathers, function () { })
      }
    }
  }
})
