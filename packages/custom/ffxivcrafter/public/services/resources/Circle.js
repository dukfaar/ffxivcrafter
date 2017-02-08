'use strict'

angular.module('mean.ffxivCrafter').factory('Circle', ['$resource',
  function ($resource) {
    return $resource('/api/rest/circle/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
