'use strict'

module.exports = function(myPackage,app,auth,db) {
  var projectStockChangeController = require('../controllers/projectStockChange')()

  app.route('/api/projectStockChange')
  .get(projectStockChangeController.list)

  app.route('/api/projectStockChange')
  .post(projectStockChangeController.create)

  app.route('/api/projectStockChange/:id')
  .get(projectStockChangeController.get)

  app.route('/api/projectStockChange/:id')
  .delete(projectStockChangeController.delete)

  app.route('/api/projectStockChange/:id')
  .put(projectStockChangeController.update)
}
