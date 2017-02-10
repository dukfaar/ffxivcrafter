'use strict'

angular.module('mean.ffxivCrafter_forum').factory('ForumThread', ['$resource',
  function ($resource) {
    return $resource('/api/forum/thread/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
