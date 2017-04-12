'use strict'

angular.module('mean.ffxivCrafter').factory('Rank', ['$resource',
  function ($resource) {
    return $resource('/api/rest/rank/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
