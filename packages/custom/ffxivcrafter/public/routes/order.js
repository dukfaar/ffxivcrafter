'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('order home', {
      url: '/order/home',
      templateUrl: 'meanStarter/views/order/index.html'
    });
  }
]);
