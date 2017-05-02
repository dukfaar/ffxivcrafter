'use strict'

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
    .state('newsletter archive', {
      url: '/newsletter/archive',
      template: '<newsletter-archive></newsletter-archive>',
      requiredCircles: {
        circles: ['see newsletter archive']
      }
    })
    .state('newsletter manage', {
      url: '/newsletter/manage',
      template: '<newsletter-manager></newsletter-manager>',
      requiredCircles: {
        circles: ['manage newsletter']
      }
    })
  }
])
