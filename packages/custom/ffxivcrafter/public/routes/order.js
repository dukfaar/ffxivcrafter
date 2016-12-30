'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('order home', {
      url: '/order/home',
      templateUrl: 'ffxivCrafter/views/order/index.html',
      requiredCircles: {
        circles: ['see order']
      }
    });
  }
]);
