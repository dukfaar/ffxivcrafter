'use strict'

//Setting up route
angular.module('mean.ffxivCrafter_gallery').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('gallery index', {
      url: '/gallery/index',
      template: '<rc-gallery></rc-gallery>',
      requiredCircles: {
        circles: ['see gallery']
      }
    })
  }
])
