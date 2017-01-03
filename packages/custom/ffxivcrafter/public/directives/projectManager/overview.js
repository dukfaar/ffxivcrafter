'use strict'

angular.module('mean.ffxivCrafter').directive('projectManagerOverview', function () {
  return {
    templateUrl: '/ffxivCrafter/views/projectManager/overview.html',
    controller: function ($scope, Global, $http, $timeout, $q, _, Project, ItemDatabase) {
      $scope.allProjects = Project.query({})
      $scope.orderProjects = []
      $scope.publicProjects = []
      $scope.ItemDatabase = ItemDatabase
      
      $scope.ccStock = {}

      $scope.allProjects.$promise.then(function () {
        $scope.orderProjects = _.filter($scope.allProjects, function (project) { return project.order })
        $scope.publicProjects = _.filter($scope.allProjects, function (project) { return project.public && !project.private })

        $scope.ccStock = {}
        _.forEach($scope.publicProjects, function (project) {
          _.forEach(project.stock, function (stockItem) {
            if (!$scope.ccStock[stockItem.item + '_' + stockItem.hq]) {
              $scope.ccStock[stockItem.item + '_' + stockItem.hq] = {item: stockItem.item, hq: stockItem.hq, amount: stockItem.amount}
            } else {
              $scope.ccStock[stockItem.item + '_' + stockItem.hq].amount += stockItem.amount
            }
          })
        })
      })
    }
  }
})
