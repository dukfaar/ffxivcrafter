'use strict'

// Setting up route
angular.module('mean.ffxivCrafter')
.config(SystemRoutes)

SystemRoutes.$inject = ['$meanStateProvider', '$urlRouterProvider']
function SystemRoutes ($meanStateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')

  $meanStateProvider
    .state('home', {
      url: '/',
      templateUrl: 'ffxivCrafter/views/system/index.html'
    })

  $meanStateProvider
      .state('new home', {
        url: '/newhome',
        templateUrl: 'ffxivCrafter/views/system/new-index.html'
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

  $meanStateProvider
      .state('notification settings', {
        url: '/notification/settings',
        template: '<notification-settings></notification-settings>'
      })
}
