'use strict'

// Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider', '$urlRouterProvider',
  function ($meanStateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/')

    // states for my app
    $meanStateProvider
      .state('home', {
        url: '/',
        templateUrl: 'ffxivCrafter/views/system/index.html'
      })

      $meanStateProvider
        .state('doldoh overview', {
          url: '/doldoh/overview',
          templateUrl: 'ffxivCrafter/views/system/doldoh-overview.html'
        })
  }
]).config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
  }
])
