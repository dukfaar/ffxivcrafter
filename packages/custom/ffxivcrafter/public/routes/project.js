'use strict'

// Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
      .state('project list', {
        url: '/project/list',
        templateUrl: 'ffxivCrafter/views/project/index.html'
      })
      .state('project settings', {
        url: '/project/settings',
        templateUrl: 'ffxivCrafter/views/project/settings.html'
      })
  }
])
