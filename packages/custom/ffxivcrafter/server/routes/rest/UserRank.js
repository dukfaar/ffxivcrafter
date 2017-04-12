'use strict'

var RestService = require('../../services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('UserRank'),
  '/api/rest/userrank'
)
