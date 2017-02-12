'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('ForumCategory'),
  '/api/forum/category'
)
