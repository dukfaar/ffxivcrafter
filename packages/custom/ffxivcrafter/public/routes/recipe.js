'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
      .state('recipe list', {
        url: '/recipe/list',
        templateUrl: 'meanStarter/views/recipe/index.html'
      });
  }
]);
