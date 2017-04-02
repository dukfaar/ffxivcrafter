'use strict'

angular.module('mean.ffxivCrafter_gallery').factory('ImageComment', ['$resource',
  function ($resource) {
    var apiBase = '/api/rest/imageComment'
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
