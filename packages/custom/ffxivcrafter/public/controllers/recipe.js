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

    var timeoutMap={};
    $scope.updateRecipe=function(recipe) {
      if(timeoutMap[recipe._id]) {
        clearTimeout(timeoutMap[recipe._id]);
      }

      timeoutMap[recipe._id]=setTimeout(function() {
        $http.put('/api/recipe/'+recipe._id,recipe)
        .then(function(response) {
        });
      },300);
    };

    $scope.showItemSelection=false;
    $scope.selectedRecipe=null;
    $scope.selectedItem=null;

    $scope.evaluateItemSelection=null;

    $scope.selectItem=function(item) {
      console.log('miau');
    };

    $scope.addInput=function(recipe) {
      $scope.showItemSelection=true;
      $scope.selectedRecipe=recipe;

      $mdDialog.show({
        templateUrl: 'meanStarter/views/recipe/itemSelection.html',
        parent: angular.element(document.body),
        controller: function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.selectItem = function(item) {
            $mdDialog.hide(item);
          };
        },
        clickOutsideToClose: true
      }).then(function(item) {
        console.log(item);
      });

      $scope.evaluateItemSelection=function() {
        $scope.selectedRecipe.inputs.push({item:$scope.selectedItem,amount:1});
        $scope.updateRecipe($scope.selectedRecipe);

        $scope.showItemSelection=false;
        $scope.selectedRecipe=null;
      };
    };

    $scope.deleteRecipe=function(recipe) {
      $http.delete('/api/recipe/'+recipe._id,recipe)
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
