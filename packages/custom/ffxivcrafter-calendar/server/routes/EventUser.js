'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

var EventUserController = RestService.createRestController('EventUser')

module.exports = RestService.createRestRoute(
  EventUserController,
  '/api/eventuser'
)
