'use strict';

angular.module('mean.system').controller('RecipeController', ['$scope', 'Global', '$http', '$mdDialog',
  function($scope, Global, $http, $mdDialog) {
    $scope.recipeList=[];

    $scope.filter='';

    $scope.jobs=['Armorer','Alchimist','Blacksmith','Carpenter','Weaver','Leatherworker','Goldsmith','Culinarian'];

    $scope.updateList=function() {
      var url='/api/recipe';
      if($scope.filter!='')
        url='/api/recipe/filteredList/'+$scope.filter;

      $http.get(url)
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
