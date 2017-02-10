'use strict'

angular.module('mean.ffxivCrafter_forum').factory('ForumPost', ['$resource',
  function ($resource) {
    return $resource('/api/forum/post/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
