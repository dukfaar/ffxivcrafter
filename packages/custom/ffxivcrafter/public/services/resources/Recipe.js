'use strict'

angular.module('mean.ffxivCrafter').factory('Recipe', ['$resource',
  function ($resource) {
    return $resource('/api/recipe/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
