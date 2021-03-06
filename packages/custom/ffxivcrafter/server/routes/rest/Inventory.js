'use strict'

var RestService = require('../../services/RestService')()

var InventoryController = RestService.createRestController('Inventory')

module.exports = RestService.createRestRoute(
  InventoryController,
  '/api/inventory'
)
