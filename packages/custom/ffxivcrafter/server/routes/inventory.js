'use strict'

module.exports = function(myPackage,app,auth,db) {
  var inventoryController = require('../controllers/inventory')()

  app.route('/api/inventory')
  .get(inventoryController.list)

  app.route('/api/inventory')
  .post(inventoryController.create)

  app.route('/api/inventory/:id')
  .get(inventoryController.get)

  app.route('/api/inventory/:id')
  .delete(inventoryController.delete)

  app.route('/api/inventory/:id')
  .put(inventoryController.update)
}
