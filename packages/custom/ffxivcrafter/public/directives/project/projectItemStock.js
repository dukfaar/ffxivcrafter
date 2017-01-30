'use strict'

angular.module('mean.ffxivCrafter').directive('projectItemStock', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/itemStock.html',
    scope: {
      project: '=',
      projectData : '='
    },
    controller: function ($scope, $http, StockService) {
      $scope.stockFilter = ''
      $scope.addToStock = StockService.addToStock

      $scope.$watch('project.stock', function() {
        $scope.stockList = $scope.project && $scope.project.stock ? Object.keys($scope.project.stock).map(function (key) { return $scope.project.stock[key] }) : []
      }, true)
    }
  }
})
