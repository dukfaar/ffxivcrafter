'use strict'

angular.module('mean.ffxivCrafter').factory('ItemPriceUpdate', ['$resource',
  function ($resource) {
    return $resource('/api/itemPriceUpdate/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })
  }
])
