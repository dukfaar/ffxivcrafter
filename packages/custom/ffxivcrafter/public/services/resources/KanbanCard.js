'use strict'

angular.module('mean.ffxivCrafter').factory('KanbanCard', ['$resource',
  function ($resource) {
    return $resource('/api/kanbancard/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
