'use strict'

angular.module('mean.ffxivCrafter_base').factory('User', ['$resource',
  function ($resource) {
    return $resource('/api/rest/user/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
