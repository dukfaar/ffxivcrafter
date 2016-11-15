'use strict'

angular.module('mean.ffxivCrafter').factory('Inventory', ['$resource',
  function ($resource) {
    return $resource('/api/inventory/:id', {id: '@id'}, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
