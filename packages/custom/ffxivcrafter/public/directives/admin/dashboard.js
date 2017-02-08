'use strict'

angular.module('mean.ffxivCrafter').directive('adminDashboard', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/dashboard.html',
    scope: {
    },
    controller: [
      '$scope', '$q', '_', 'UserService', '$http', 'socket',
      function ($scope, $q, _, UserService, $http, socket) {
        $scope.itemimportNoOW = {
          started: false,
          running: false,
          done: false,
          itemsDone: 0,
          totalItems: 0
        }

        $scope.itemimport = {
          started: false,
          running: false,
          done: false,
          itemsDone: 0,
          totalItems: 0
        }

        $scope.recipeImportNoOW = {
          started: false,
          running: false,
          done: false,
          recipesDone: 0,
          newRecipes: 0,
          totalRecipes: 0
        }

        $scope.recipeImport = {
          started: false,
          running: false,
          done: false,
          recipesDone: 0,
          newRecipes: 0,
          totalRecipes: 0
        }

        function xivdbImportNoOWProgressWatcher (data) {
          $scope.recipeImportNoOW.recipesDone = data.recipesDone
          $scope.recipeImportNoOW.newRecipes = data.newRecipes
          $scope.recipeImportNoOW.totalRecipes = data.totalRecipes

          $scope.$apply()
        }

        function xivdbImportNoOWDoneWatcher (data) {
          $scope.recipeImportNoOW.running = false
          $scope.recipeImportNoOW.done = true

          $scope.$apply()
        }

        function fullXivdbImportProgressWatcher (data) {
          $scope.recipeImport.recipesDone = data.recipesDone
          $scope.recipeImport.newRecipes = data.newRecipes
          $scope.recipeImport.totalRecipes = data.totalRecipes

          $scope.$apply()
        }

        function fullXivdbImportDoneWatcher (data) {
          $scope.recipeImport.running = false
          $scope.recipeImport.done = true

          $scope.$apply()
        }

        function itemImportNoOWDoneWatcher (data) {
          $scope.itemimportNoOW.running = false
          $scope.itemimportNoOW.done = true

          $scope.$apply()
        }

        function itemImportNoOWProgressWatcher (data) {
          $scope.itemimportNoOW.itemsDone = data.itemsDone
          $scope.itemimportNoOW.totalItems = data.totalItems

          $scope.$apply()
        }

        function itemImportDoneWatcher (data) {
          $scope.itemimport.running = false
          $scope.itemimport.done = true

          $scope.$apply()
        }

        function itemImportProgressWatcher (data) {
          $scope.itemimport.itemsDone = data.itemsDone
          $scope.itemimport.totalItems = data.totalItems

          $scope.$apply()
        }

        socket.on('xivdb item import noow done', itemImportNoOWDoneWatcher)
        socket.on('xivdb item import noow progress', itemImportNoOWProgressWatcher)

        socket.on('xivdb item import done', itemImportDoneWatcher)
        socket.on('xivdb item import progress', itemImportProgressWatcher)

        socket.on('fullXivdbRecipeImport progress', fullXivdbImportProgressWatcher)
        socket.on('fullXivdbRecipeImport done', fullXivdbImportDoneWatcher)

        socket.on('xivdbRecipeImportNoOverwrite progress', xivdbImportNoOWProgressWatcher)
        socket.on('xivdbRecipeImportNoOverwrite done', xivdbImportNoOWDoneWatcher)

        $scope.$on('$destroy', function () {
          socket.off('xivdb item import noow done', itemImportNoOWDoneWatcher)
          socket.off('xivdb item import noow progress', itemImportNoOWProgressWatcher)

          socket.off('xivdb item import done', itemImportDoneWatcher)
          socket.off('xivdb item import progress', itemImportProgressWatcher)

          socket.off('fullXivdbImport progress', fullXivdbImportProgressWatcher)
          socket.off('fullXivdbImport done', fullXivdbImportDoneWatcher)

          socket.off('xivdbRecipeImportNoOverwrite progress', xivdbImportNoOWProgressWatcher)
          socket.off('xivdbRecipeImportNoOverwrite done', xivdbImportNoOWDoneWatcher)
        })

        $scope.triggerXivdbItemImportNoOW = function () {
          $http.get('/api/importnoOW/item/').then(function (result) {
            $scope.itemimportNoOW.started = true
            $scope.itemimportNoOW.running = true
            $scope.itemimportNoOW.done = false
          })
        }

        $scope.triggerXivdbItemImport = function () {
          $http.get('/api/import/item/').then(function (result) {
            $scope.itemimport.started = true
            $scope.itemimport.running = true
            $scope.itemimport.done = false
          })
        }

        $scope.triggerXivdbRecipeImport = function () {
          $http.get('/api/import/recipe').then(function (result) {
            $scope.recipeImport.started = true
            $scope.recipeImport.running = true
            $scope.recipeImport.done = false
          })
        }

        $scope.triggerXivdbRecipeImportNoOW = function () {
          $http.get('/api/importnoOW/recipe').then(function (result) {
            $scope.recipeImportNoOW.started = true
            $scope.recipeImportNoOW.running = true
            $scope.recipeImportNoOW.done = false
          })
        }
      }
    ]
  }
})
