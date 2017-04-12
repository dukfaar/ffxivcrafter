'use strict'

angular.module('mean.ffxivCrafter').factory('UserRank', ['$resource',
  function ($resource) {
    return $resource('/api/rest/userrank/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
