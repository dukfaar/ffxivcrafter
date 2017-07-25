'use strict'

angular.module('mean.ffxivCrafter_bot').factory('UselessFact', UselessFact)

UselessFact.$inject = ['$resource']

function UselessFact ($resource) {
  var apiBase = '/api/rest/uselessfact/'
  return $resource(apiBase + ':id', {id: '@id'}, {
    update: {
      method: 'PUT'
    },
    create: {
      method: 'POST'
    },
    count: {
      method: 'GET',
      url: apiBase + 'count'
    }
  })
}
