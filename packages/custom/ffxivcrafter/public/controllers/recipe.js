'use strict';

angular.module('mean.system').controller('RecipeController', ['$scope', 'Global', '$http', '$mdDialog',
  function($scope, Global, $http, $mdDialog) {
    $scope.recipeList=[];

    $scope.filter='';

    $scope.recipeFilter=function(recipe) {
      if(recipe.outputs.length===0) return true;

      if($scope.filter==='') return true; 

      for(var i in recipe.outputs) {
        var output=recipe.outputs[i];

        if(output.item.name.toLowerCase().search($scope.filter.toLowerCase()))
          return true;
      }

      return false;
    };

    $scope.updateList=function() {
      $http.get('/api/recipe')
      .then(function(response) {
        $scope.recipeList=response.data;
      });
    };

    $scope.createRecipe=function() {
      $http.post('/api/recipe')
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.updateRecipe=function(recipe) {
      $http.put('/api/recipe/'+recipe._id,recipe)
      .then(function(response) {
      });
    };

    function openItemSelectionDialog() {
      return $mdDialog.show({
        templateUrl: 'meanStarter/views/item/itemSelection.html',
        parent: angular.element(document.body),
        controller: 'ItemSelectionDialogController',
        clickOutsideToClose: true
      });
    }

    $scope.addInput=function(recipe) {
      openItemSelectionDialog()
      .then(function(item) {
        recipe.inputs.push({item:item,amount:1});
        $scope.updateRecipe(recipe);
      });
    };

    $scope.addOutput=function(recipe) {
      openItemSelectionDialog()
      .then(function(item) {
        recipe.outputs.push({item:item,amount:1});
        $scope.updateRecipe(recipe);
      });
    };

    $scope.deleteRecipe=function(recipe) {
      $http.delete('/api/recipe/'+recipe._id,recipe)
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.editMode=false;

    $scope.updateList();
  }
]);
