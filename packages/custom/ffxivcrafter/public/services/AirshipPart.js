'use strict'

angular.module('mean.ffxivCrafter').factory('AirshipPart', ['$resource',
  function ($resource) {
    return $resource('/api/airshipPart/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
