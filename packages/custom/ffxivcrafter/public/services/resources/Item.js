'use strict'

angular.module('mean.ffxivCrafter').factory('Item', ['$resource',
  function ($resource) {
    return $resource('/api/item/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
