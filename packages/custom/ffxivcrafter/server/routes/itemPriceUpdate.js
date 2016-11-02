'use strict'

module.exports = function (myPackage, app, auth, db) {
  var itemPriceUpdateController = require('../controllers/ItemPriceUpdate')()

  app.route('/api/itemPriceUpdate')
  .get(itemPriceUpdateController.list)

  app.route('/api/itemPriceUpdate')
  .post(itemPriceUpdateController.create)

  app.route('/api/itemPriceUpdate/:id')
  .get(itemPriceUpdateController.get)

  app.route('/api/itemPriceUpdate/:id')
  .delete(itemPriceUpdateController.delete)

  app.route('/api/itemPriceUpdate/:id')
  .put(itemPriceUpdateController.update)
}
