'use strict';

angular.module('mean.ffxivCrafter').controller('CraftingController', ['$scope', 'Global', '$http', '$mdDialog',
  function($scope, Global, $http, $mdDialog) {
    $scope.itemList=null;

    $scope.craftingData={};

    $scope.filter='';

    $scope.order={
      amount: 1
    };


    $scope.updateList=function() {
      var url='/api/item';
      if($scope.filter!=='')
        url='/api/item/filteredList/'+$scope.filter;

      $http.get(url,{params:{limit:10}})
      .then(function(response) {
        $scope.itemList=response.data.list;
      });
    };

    $scope.updateList();

    $scope.selectedItem=null;

    function processRecipe(recipe,multiplier) {
      angular.forEach(recipe.inputs,function(value,key) {

        $http.get('/api/recipe/by_output/'+value.item._id)
        .then(function(response) {
          if(response.data.length>0) {
           processRecipe(response.data[0],1);
         } else {
           if(!$scope.craftingMaterials[value.item._id]) {
             $scope.craftingMaterials[value.item._id]={item:value.item,amount:0};
           }

           $scope.craftingMaterials[value.item._id].amount+=value.amount*multiplier;
         }
        });
      });
    }

    $scope.selectItem=function(item) {
      $scope.selectedItem=item;

      $http.get('/api/crafting/'+item._id)
      .then(function(response) {
        $scope.craftingData=response.data;
      });
    };

    $scope.projectFromItem=function(item) {
      console.log($scope.order.amount);
      $http.post('/api/project/fromItem/'+item._id+"/"+$scope.order.amount)
      .then(function(response) {

      });
    };
  }
]);
