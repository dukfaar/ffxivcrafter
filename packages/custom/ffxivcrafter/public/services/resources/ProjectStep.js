'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectStep', ['$resource',
  function ($resource) {
    return $resource('/api/projectStep/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
