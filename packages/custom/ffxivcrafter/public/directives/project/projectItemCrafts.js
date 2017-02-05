'use strict'

angular.module('mean.ffxivCrafter').directive('projectItemCrafts', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/itemCrafts.html',
    scope: {
      project: '=',
      projectData: '='
    },
    controller: function ($scope, $http, deliveryService, StockService) {
      $scope.craftableFilter = ''
      $scope.addToStock = StockService.addToStock

      $scope.$watch('projectData.craftableSteps', function () {
        $scope.craftableList = $scope.projectData && $scope.projectData.craftableSteps ? Object.keys($scope.projectData.craftableSteps).map(function (key) { return $scope.projectData.craftableSteps[key] }) : []
      }, true)

      $scope.deliveryCraftDialog = function (project, item, step, craftable) {
        deliveryService.deliveryCraftDialog(project, item, step, craftable, function () { })
      }
    }
  }
})
