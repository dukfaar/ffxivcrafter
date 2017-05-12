'use strict'

angular.module('mean.ffxivCrafter_bot').factory('BotReaction', BotReaction)

BotReaction.$inject = ['$resource']

function BotReaction ($resource) {
  var apiBase = '/api/rest/botreaction/'
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
