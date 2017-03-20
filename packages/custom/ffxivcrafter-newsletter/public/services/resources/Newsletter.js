'use strict'

angular.module('mean.ffxivCrafter_newsletter').factory('Newsletter', ['$resource',
  function ($resource) {
    var apiBase = '/api/newsletter/'
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
