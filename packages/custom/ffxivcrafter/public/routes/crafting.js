'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('crafting home', {
      url: '/crafting/home',
      templateUrl: 'meanStarter/views/crafting/index.html'
    });
  }
]);
