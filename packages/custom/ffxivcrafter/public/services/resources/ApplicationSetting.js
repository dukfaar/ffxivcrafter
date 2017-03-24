'use strict'

angular.module('mean.ffxivCrafter').factory('ApplicationSetting', ['$resource',
  function ($resource) {
    return $resource('/api/rest/applicationsetting/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
