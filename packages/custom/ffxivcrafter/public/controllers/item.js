'use strict';

angular.module('mean.system').controller('ItemController', ['$scope', 'Global','$http', '$mdDialog',
  function($scope, Global,$http, $mdDialog) {
    $scope.itemList=[];
    $scope.tableMode=false;

    $scope.filter='';

    $scope.updateList=function() {
      var url='/api/item';
      if($scope.filter!='')
        url='/api/item/filteredList/'+$scope.filter;

      $http.get(url)
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
    };

    $scope.openImport=function() {
      $mdDialog.show({
        templateUrl: 'meanStarter/views/item/importDialog.html',
        parent: angular.element(document.body),
        controller: 'ItemImportDialogController',
        clickOutsideToClose: true
      });
    };

    $scope.editMode=false;

    $scope.updateList();
  }
]);
