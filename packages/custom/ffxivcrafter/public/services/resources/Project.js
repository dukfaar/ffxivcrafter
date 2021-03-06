'use strict'

angular.module('mean.ffxivCrafter').factory('Project', ['$resource',
  function ($resource) {
    return $resource('/api/rest/project/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
