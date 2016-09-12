'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
      .state('item list', {
        url: '/item/list',
        templateUrl: 'ffxivCrafter/views/item/index.html'
      });
  }
]);
