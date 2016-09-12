'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('crafting home', {
      url: '/crafting/home',
      templateUrl: 'ffxivCrafter/views/crafting/index.html'
    });
  }
]);
