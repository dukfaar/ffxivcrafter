'use strict'

angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('crud list', {
      url: '/crud/list/:modelName',
      templateUrl: 'ffxivCrafter/views/crud/list.html',
      requiredCircles: {
        circles: ['admin']
      }
    })
    .state('crud schema', {
      url: '/crud/schema/:modelName',
      template: '<crud-schema></crud-schema>',
      requiredCircles: {
        circles: ['admin']
      }
    })
    .state('crud view', {
      url: '/crud/view/:modelName/:id',
      template: '<crud-view></crud-view>',
      requiredCircles: {
        circles: ['admin']
      }
    })
    .state('crud edit', {
      url: '/crud/edit/:modelName/:id',
      template: '<crud-edit></crud-edit>',
      requiredCircles: {
        circles: ['admin']
      }
    })
  }
])
