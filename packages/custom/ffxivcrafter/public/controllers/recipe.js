'use strict'

angular.module('mean.ffxivCrafter').controller('RecipeController',
  ['$scope', 'Global', '$http', '$mdDialog', '_', 'Recipe', 'ItemDatabase',
    function ($scope, Global, $http, $mdDialog, _, Recipe, ItemDatabase) {
      $scope.ItemDatabase = ItemDatabase

      $scope.recipeList = []

      $scope.filter = ''

      $scope.recipeFilter = function (recipe) {
        if (recipe.outputs.length === 0) return true

        if ($scope.filter === '') return true

        for (var i in recipe.outputs) {
          var output = recipe.outputs[i]

          if (output.item.name.toLowerCase().search($scope.filter.toLowerCase()) !== -1) {
            return true
          }
        }

        return false
      }

      function copyRecipeArray(array) {
        return _.map(array, function (it) { return {item: it.item, amount: it.amount} })
      }
      
      function doCopy (recipe) {
        var newRecipe = new Recipe()
        newRecipe.craftingJob = recipe.craftingJob
        newRecipe.craftingLevel = recipe.craftingLevel
        newRecipe.inputs = copyRecipeArray(recipe.inputs)
        newRecipe.outputs = copyRecipeArray(recipe.outputs)

        newRecipe.$save().then(function () {
          $scope.updateList()
        })
      }

      $scope.copyRecipe = function (recipe) {
        $mdDialog.show(
          $mdDialog.confirm()
          .title('Confirm copy')
          .textContent('Do you really want to copy this recipe?')
          .ok('Just do it')
          .cancel('No!')
        ).then(function () {
          doCopy(recipe)
        })
      }

      $scope.updateList = function () {
        $scope.recipeList = Recipe.query({populate: 'outputs.item'})
      }

      $scope.createRecipe = function () {
        $http.post('/api/recipe')
        .then(function (response) {
          $scope.updateList()
        })
      }

      $scope.updateRecipe = function (recipe) {
        Recipe.update({id: recipe._id}, recipe)
      }

      $scope.xivdbImportId = 0

      $scope.xivdbImport = function () {
        $http.post('/api/recipe/xivdbImport/' + $scope.xivdbImportId)
        .then(function (response) {
          $scope.updateList()
        })
      }

      function openItemSelectionDialog () {
        return $mdDialog.show({
          templateUrl: 'ffxivCrafter/views/item/itemSelection.html',
          parent: angular.element(document.body),
          controller: 'ItemSelectionDialogController',
          clickOutsideToClose: true
        })
      }

      $scope.addInput = function (recipe) {
        openItemSelectionDialog()
        .then(function (item) {
          recipe.inputs.push({item: item, amount: 1})
          $scope.updateRecipe(recipe)
        })
      }

      $scope.removeInput = function (recipe, item) {
        recipe.inputs = _.reject(recipe.inputs, function (input) { return input.item._id === item._id })
        $scope.updateRecipe(recipe)
      }

      $scope.removeOutput = function (recipe, item) {
        recipe.outputs = _.reject(recipe.outputs, function (output) { return output.item._id === item._id })
        $scope.updateRecipe(recipe)
      }

      $scope.addOutput = function (recipe) {
        openItemSelectionDialog()
        .then(function (item) {
          recipe.outputs.push({item: item, amount: 1})
          $scope.updateRecipe(recipe)
        })
      }

      $scope.deleteRecipe = function (recipe) {
        $mdDialog.show(
          $mdDialog.confirm()
          .title('Confirm deletion')
          .textContent('Do you really want to delete this recipe?')
          .ok('Just do it')
          .cancel('No!')
        ).then(function () {
          Recipe.delete({id: recipe._id})
          .$promise.then(function (response) {
            $scope.updateList()
          })
        })
      }

      $scope.editMode = false

      $scope.updateList()
    }
  ])
