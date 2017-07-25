'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

var controller = RestService.createRestController('UselessFact')

module.exports = RestService.createRestRoute(
  controller,
  '/api/rest/uselessfact'
)
