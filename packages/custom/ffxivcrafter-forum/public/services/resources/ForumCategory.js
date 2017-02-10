'use strict'

angular.module('mean.ffxivCrafter_forum').factory('ForumCategory', ['$resource',
  function ($resource) {
    return $resource('/api/forum/category/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
