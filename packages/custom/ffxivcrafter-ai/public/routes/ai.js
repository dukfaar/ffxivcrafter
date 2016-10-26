'use strict'

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('ai home', {
      url: '/ai/home',
      templateUrl: 'ffxivCrafter-ai/views/ai/index.html'
    })
  }
])
