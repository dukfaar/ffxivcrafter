'use strict'

angular.module('mean.ffxivCrafter').factory('UserCombatClasses', ['$resource',
  function ($resource) {
    return $resource('/api/rest/usercombatclasses/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
