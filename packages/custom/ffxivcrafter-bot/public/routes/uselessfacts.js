'use strict'

angular.module('mean.ffxivCrafter_bot').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('uselessfacts index', {
      url: '/uselessfacts/index',
      template: '<uselessfacts-manager></uselessfacts-manager>',
      requiredCircles: {
        circles: ['edit uselessfacts']
      }
    })
  }
])
