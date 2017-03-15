'use strict'

angular.module('mean.ffxivCrafter_gallery').factory('Image', ['$resource',
  function ($resource) {
    var apiBase = '/api/image/'
    return $resource(apiBase + ':id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      },
      count: {
        method: 'GET',
        url: apiBase + 'count'
      }
    })
  }
])
