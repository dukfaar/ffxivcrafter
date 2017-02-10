'use strict'

var RestService = require('../../../ffxivCrafter/server/services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('ForumPost'),
  '/api/forum/post'
)
