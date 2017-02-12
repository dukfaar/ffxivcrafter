'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('ForumPost'),
  '/api/forum/post'
)
