'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
      .state('recipe list', {
        url: '/recipe/list',
        templateUrl: 'ffxivCrafter/views/recipe/index.html'
      });
  }
]);
