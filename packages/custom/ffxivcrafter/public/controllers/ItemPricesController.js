'use strict'

angular.module('mean.ffxivCrafter').controller('ItemPricesController', ['$scope', '$http', 'socket', 'MeanUser', '$q', 'localStorageService', 'ItemPriceUpdate', 'Project', '$stateParams', '_',
  function ($scope, $http, socket, MeanUser, $q, localStorageService, ItemPriceUpdate, Project, $stateParams, _) {
    $scope.updates = []

    $scope.chart = {
      series: ['NQ', 'HQ'],
      labels: [],
      data: [[], []],
      options: {}
    }

    $scope.updateData = function () {
      $scope.updates = ItemPriceUpdate.query({item: $stateParams.itemId})
    }

    $scope.$watch('updates', function () {
      $scope.chart.labels = _.map($scope.updates, function (update) { return update.date })
      $scope.chart.data[0] = _.map($scope.updates, function (update) { return update.price })
      $scope.chart.data[1] = _.map($scope.updates, function (update) { return update.priceHQ })
    }, true)

    $scope.updateData()

    socket.on('new price change entry', function (data) {
      $scope.updateData()
    })
  }
])
