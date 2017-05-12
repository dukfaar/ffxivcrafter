'use strict'

angular.module('mean.ffxivCrafter_bot').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('botreaction index', {
      url: '/botreaction/index',
      template: '<bot-reaction-manager></bot-reaction-manager>',
      requiredCircles: {
        circles: ['edit botreactions']
      }
    })
  }
])
