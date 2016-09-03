'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('doldoh config', {
      url: '/user/doldoh',
      templateUrl: 'meanStarter/views/users/doldoh.html'
    });
  }
]);
