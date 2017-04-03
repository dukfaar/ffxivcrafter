'use strict'

angular.module('mean.ffxivCrafter_forum').factory('ForumPost', ['$resource',
  function ($resource) {
    let apiBase = '/api/forum/post/'
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
