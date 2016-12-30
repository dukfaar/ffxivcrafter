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
        templateUrl: 'ffxivCrafter/views/system/doldoh-overview.html',
        requiredCircles: {
          circles: ['projectManager']
        }
      })

    $meanStateProvider
      .state('theme settings', {
        url: '/theme/settings',
        templateUrl: 'ffxivCrafter/views/system/theme.html'
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
