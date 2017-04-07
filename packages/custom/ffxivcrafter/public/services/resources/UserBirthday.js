'use strict'

angular.module('mean.ffxivCrafter').factory('UserBirthday', ['$resource',
  function ($resource) {
    return $resource('/api/rest/userbirthday/:id', {id: '@id'}, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
