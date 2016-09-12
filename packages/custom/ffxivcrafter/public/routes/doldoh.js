'use strict';

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('doldoh config', {
      url: '/user/doldoh',
      templateUrl: 'ffxivCrafter/views/users/doldoh.html'
    });
  }
]);
