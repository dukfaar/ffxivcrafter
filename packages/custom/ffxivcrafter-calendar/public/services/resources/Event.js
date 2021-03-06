'use strict'

angular.module('mean.ffxivCrafter_calendar').factory('Event', ['$resource',
  function ($resource) {
    return $resource('/api/event/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
