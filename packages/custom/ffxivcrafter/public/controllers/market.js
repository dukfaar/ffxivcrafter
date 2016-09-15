'use strict'

angular.module('mean.ffxivCrafter').controller('MarketController', ['$scope', '$mdDialog', '$http',
  function ($scope, $mdDialog, $http) {
    $scope.itemList = {}
    $scope.filter = ''

    $scope.updateList = function () {
      var url = '/api/item'
      if ($scope.filter !== '')
        url = '/api/item/filteredList/' + $scope.filter

      $http.get(url, {params: {limit: 10, mbItems: true}})
        .then(function (response) {
          $scope.itemList = response.data.list
        })
    }

    $scope.updateList()
  }
])
