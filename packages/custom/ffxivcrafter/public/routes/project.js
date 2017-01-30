'use strict'

// Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
      .state('project view', {
        url: '/project/view/:projectId',
        template: '<projects-view></projects-view>',
        requiredCircles: {
          circles: ['see projects']
        }
      })
      .state('project private', {
        url: '/project/private',
        template: '<projects-private></projects-private>',
        requiredCircles: {
          circles: ['see projects']
        }
      })
      .state('project settings', {
        url: '/project/settings',
        templateUrl: 'ffxivCrafter/views/project/settings.html',
        requiredCircles: {
          circles: ['see projects']
        }
      })
      .state('project reporting', {
        url: '/project/reporting/:projectId',
        templateUrl: 'ffxivCrafter/views/project/reporting.html',
        requiredCircles: {
          circles: ['see projects']
        }
      })
  }
])
