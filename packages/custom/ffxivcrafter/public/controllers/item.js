'use strict';

angular.module('mean.ffxivCrafter').controller('ItemController', ['$scope', 'Global','$http', '$mdDialog', 'MeanUser',
  function($scope, Global,$http, $mdDialog, MeanUser) {
    $scope.user=MeanUser;
    $scope.allowed=function(perm) {
      return MeanUser.acl.allowed&&MeanUser.acl.allowed.indexOf(perm)!=-1;
    };

    $scope.itemList=[];
    $scope.itemCount=0;
    $scope.maxPage=0;

    $scope.filter='';

    $scope.limit=10;
    $scope.page=0;

    $scope.prevPage=function() {
      if($scope.page>0) {
        $scope.page--;
        $scope.updateList();
      }
    };
    $scope.nextPage=function() {
      if($scope.page<$scope.maxPage) {
        $scope.page++;
        $scope.updateList();
      }
    };
    $scope.toPage=function(pageNum) {
      if($scope.page!=pageNum) {
        $scope.page=pageNum;
        $scope.updateList();
      }
    };

    $scope.pageArray=function() {
      var result=[];
      for(var i=0;i<=$scope.maxPage;i++) result.push(i);

      return result;
    };


    $scope.updateList=function() {
      var url='/api/item';
      if($scope.filter!='')
        url='/api/item/filteredList/'+$scope.filter;

      $http.get(url,{params:{limit:$scope.limit,page:$scope.page}})
      .then(function(response) {
        $scope.itemCount=response.data.count;
        $scope.itemList=response.data.list;
        $scope.maxPage=Math.floor($scope.itemCount/$scope.limit);
      });
    };

    $scope.createItem=function() {
      $http.post('/api/item')
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.updateItem=function(item) {
      $http.put('/api/item/'+item._id,item)
      .then(function(response) {
      });
    };

    $scope.deleteItem=function(item) {
      $http.delete('/api/item/'+item._id,item)
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.openImport=function() {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/item/importDialog.html',
        parent: angular.element(document.body),
        controller: 'ItemImportDialogController',
        clickOutsideToClose: true
      });
    };

    $scope.updateList();
  }
]);
