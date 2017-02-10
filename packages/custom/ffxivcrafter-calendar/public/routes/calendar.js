'use strict'

//Setting up route
angular.module('mean.ffxivCrafter_calendar').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('events calendar', {
      url: '/events/calendar',
      template: '<event-calendar></event-calendar>',
      requiredCircles: {
        circles: ['see calendar']
      }
    })
  }
])
