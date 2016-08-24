'use strict';

angular.module('mean.system').controller('ItemController', ['$scope', 'Global','$http',
  function($scope, Global,$http) {
    $scope.itemList=[];

    $scope.updateList=function() {
      $http.get('/api/item')
      .then(function(response) {
        $scope.itemList=response.data;
      });
    };

    $scope.createItem=function() {
      $http.post('/api/item')
      .then(function(response) {
        $scope.updateList();
      });
    };

    var timeoutMap={};
    $scope.updateItem=function(item) {
      if(timeoutMap[item._id]) {
        clearTimeout(timeoutMap[item._id]);
      }

      timeoutMap[item._id]=setTimeout(function() {
        $http.put('/api/item/'+item._id,item)
        .then(function(response) {
        });
      },300);
    };

    $scope.deleteItem=function(item) {
      $http.delete('/api/item/'+item._id,item)
      .then(function(response) {
        $scope.updateList();
      });
    }

    $scope.editMode=false;

    $scope.toggleEditMode=function() {
      $scope.editMode=!$scope.editMode;
    };

    $scope.updateList();
  }
]);
