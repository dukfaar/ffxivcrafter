'use strict'

//Setting up route
angular.module('mean.ffxivCrafter_newsletter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('newsletter index', {
      url: '/newsletter/index',
      templateUrl: '/ffxivCrafter_newsletter/views/index.html',
      requiredCircles: {
        circles: ['see newsletter']
      }
    })
    .state('newsletter manage', {
      url: '/newsletter/manage',
      templateUrl: '/ffxivCrafter_newsletter/views/manage.html',
      requiredCircles: {
        circles: ['manage newsletter']
      }
    })
  }
])
