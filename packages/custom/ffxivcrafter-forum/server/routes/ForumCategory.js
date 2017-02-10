'use strict'

var RestService = require('../../../ffxivCrafter/server/services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('ForumCategory'),
  '/api/forum/category'
)
