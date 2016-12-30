'use strict'

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('inventory index', {
      url: '/user/inventory',
      template: '<rc-inventory></rc-inventory>',
      requiredCircles: {
        circles: ['use inventory']
      }
    })
  }
])
