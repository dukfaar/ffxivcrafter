'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectStockChange', ['$resource',
  function ($resource) {
    return $resource('/api/projectStockChange/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
