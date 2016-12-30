'use strict'

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
      .state('item list', {
        url: '/item/list',
        templateUrl: 'ffxivCrafter/views/item/index.html',
        requiredCircles: {
          circles: ['see items']
        }
      })
      .state('item prices', {
        url: '/item/prices/:itemId',
        templateUrl: 'ffxivCrafter/views/item/prices.html',
        requiredCircles: {
          circles: ['see items']
        }
      })
  }
])
