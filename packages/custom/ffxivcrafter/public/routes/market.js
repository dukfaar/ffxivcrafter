'use strict'

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('market home', {
      url: '/market/home',
      templateUrl: 'ffxivCrafter/views/market/index.html'
    })
  }
])
