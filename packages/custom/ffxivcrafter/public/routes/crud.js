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
      template: params => '<crud-schema></crud-schema>',
      requiredCircles: {
        circles: ['admin']
      }
    })
  }
])
