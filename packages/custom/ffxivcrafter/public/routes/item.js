'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
      .state('item list', {
        url: '/item/list',
        templateUrl: 'meanStarter/views/item/index.html'
      });
  }
]);
