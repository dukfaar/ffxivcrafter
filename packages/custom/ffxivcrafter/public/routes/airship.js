'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('airship home', {
      url: '/airship/home',
      templateUrl: 'ffxivCrafter/views/airship/index.html'
    });
  }
]);
