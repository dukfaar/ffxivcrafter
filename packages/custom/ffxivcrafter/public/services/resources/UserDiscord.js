'use strict'

angular.module('mean.ffxivCrafter').factory('UserDiscord', ['$resource',
  function ($resource) {
    return $resource('/api/rest/userdiscord/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
