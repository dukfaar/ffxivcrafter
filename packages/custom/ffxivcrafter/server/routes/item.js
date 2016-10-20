'use strict'

module.exports = function (myPackage, app, auth, db, io) {
  var itemController = require('../controllers/item')(io)

  app.route('/api/item/updateAllAgeMultipliers')
    .put(itemController.updateAllAgeMultipliers)

  app.route('/api/item')
    .get(itemController.list)

  app.route('/api/item/filteredList/:q')
    .get(itemController.filteredList)

  app.route('/api/item/oldest')
    .get(itemController.oldest)

  app.route('/api/item/:id')
    .get(itemController.get)

  app.route('/api/item')
    .post(itemController.create)

  app.route('/api/item/importList')
    .post(itemController.importList)

  app.route('/api/item/:id')
    .delete(itemController.delete)

  app.route('/api/item/:id')
    .put(itemController.update)

  app.route('/api/price/:id/:price/:priceHQ')
    .put(itemController.updatePrice)

  app.route('/api/import/item/:id')
    .get(itemController.xivdbImport)

  app.route('/api/importnoOW/item/')
    .get(itemController.fullXivdbImportNoOverwrite)

  app.route('/api/import/item/')
    .get(itemController.fullXivdbImport)


}
