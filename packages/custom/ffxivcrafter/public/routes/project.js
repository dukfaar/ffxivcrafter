'use strict';

//Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
      .state('project list', {
        url: '/project/list',
        templateUrl: 'meanStarter/views/project/index.html'
      });
  }
]);
