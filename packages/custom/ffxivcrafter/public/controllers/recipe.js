'use strict';

angular.module('mean.system').controller('RecipeController', ['$scope', 'Global', '$http', '$mdDialog',
  function($scope, Global, $http, $mdDialog) {
    $scope.recipeList=[];

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

    var timeoutMap={};
    $scope.updateRecipeTimed=function(recipe) {
      if(timeoutMap[recipe._id]) {
        clearTimeout(timeoutMap[recipe._id]);
      }

      timeoutMap[recipe._id]=setTimeout(function() {
        $scope.updateRecipe(recipe);
      },300);
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
    }

    $scope.editMode=false;

    $scope.updateList();
  }
]);
