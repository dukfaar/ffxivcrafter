'use strict'

angular.module('mean.ffxivCrafter_calendar').factory('EventUser', ['$resource',
  function ($resource) {
    return $resource('/api/eventuser/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
