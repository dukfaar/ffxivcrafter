'use strict';

angular.module('mean.system').controller('ItemController', ['$scope', 'Global','$http',
  function($scope, Global,$http) {
    $scope.updateList=function() {
      $http.get('/api/item')
      .then(function(response) {
        console.log(response);
        $scope.itemList=response.data;
      });
    };

    $scope.createItem=function() {
      $http.post('/api/item')
      .then(function(response) {
        console.log(response);
        $scope.updateList();
      });
    };

    $scope.updateList();
  }
]);
