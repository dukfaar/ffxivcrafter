'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectNonRest', ['$resource',
  function ($resource) {
    return $resource('/api/project/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
