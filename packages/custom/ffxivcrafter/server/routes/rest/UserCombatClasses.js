'use strict'

var RestService = require('../../services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('UserCombatClasses'),
  '/api/rest/usercombatclasses'
)
