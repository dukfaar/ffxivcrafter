'use strict'

module.exports = function (myPackage, app, auth, db, io) {
  var controller = require('../controllers/crud')(io)

  var apiBase = '/api/crud/:modelName'
  var schemaApiBase = '/api/schema/:modelName'

  app.route(schemaApiBase)
  .get(controller.schema)

  app.route(apiBase)
  .get(controller.list)

  app.route(apiBase)
  .post(controller.create)

  app.route(apiBase + '/:id')
  .get(controller.get)

  app.route(apiBase + '/:id')
  .delete(controller.delete)

  app.route(apiBase + '/:id')
  .put(controller.update)
}
