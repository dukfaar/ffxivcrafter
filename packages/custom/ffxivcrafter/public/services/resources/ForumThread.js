'use strict'

angular.module('mean.ffxivCrafter').factory('ForumThread', ['$resource',
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
