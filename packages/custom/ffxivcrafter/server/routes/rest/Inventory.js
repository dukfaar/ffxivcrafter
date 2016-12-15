'use strict'

var RestService = require('../../services/RestService')()

var InventoryController = RestService.createRestController('Inventory')
InventoryController.list = function (req, res) {
  var q = {}

  if(req.query.userInventory) {
    q.user = req.user._id
  }

  RestService.list(InventoryController.Model.find(q), req)
  .then(function (result) {
    res.send(result)
  })
  .catch(function (err) {
    res.status(500).send(err)
  })
}

module.exports = RestService.createRestRoute(
  InventoryController,
  '/api/inventory'
)
