'use strict';

angular.module('mean.system').directive('craftingTreeItem',function() {
  return {
    templateUrl:'/meanStarter/views/crafting/craftingTreeItem.html',
    scope: {
      tree: '='
    }
  };
});

angular.module('mean.system').controller('CraftingController', ['$scope', 'Global', '$http', '$mdDialog',
  function($scope, Global, $http, $mdDialog) {
    $scope.itemList=null;

    $scope.craftingData={};

    $http.get('/api/item')
    .then(function(response) {
      $scope.itemList=response.data;
    });

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
  }
]);
