'use strict'

var RestService = require('../../services/RestService')()

module.exports = RestService.createRestRoute(
  RestService.createRestController('UserBirthday'),
  '/api/rest/userbirthday'
)
