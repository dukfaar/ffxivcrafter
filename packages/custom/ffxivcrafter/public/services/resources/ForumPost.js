'use strict'

angular.module('mean.ffxivCrafter').factory('ForumPost', ['$resource',
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
