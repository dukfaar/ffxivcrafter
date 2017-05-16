'use strict'

//Setting up route
angular.module('mean.ffxivCrafter_forum').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('forum index', {
      url: '/forum/index',
      template: '<forum-index></forum-index>',
      requiredCircles: {
        circles: ['see forum']
      }
    })
    .state('forum category', {
      url: '/forum/category/:id',
      templateProvider: function ($stateParams) {
        return '<page-base><forum-category category-id="\'' + $stateParams.id + '\'"></forum-category></page-base>'
      },
      requiredCircles: {
        circles: ['see forum']
      }
    })
    .state('forum thread', {
      url: '/forum/thread/:id',
      templateProvider: function ($stateParams) {
        return '<forum-thread thread-id="\'' + $stateParams.id + '\'"></forum-thread>'
      },
      requiredCircles: {
        circles: ['see forum']
      }
    })
  }
])
