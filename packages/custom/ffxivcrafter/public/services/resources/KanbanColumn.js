'use strict'

angular.module('mean.ffxivCrafter').factory('KanbanColumn', ['$resource',
  function ($resource) {
    return $resource('/api/kanbancolumn/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
