'use strict'

module.exports = function (myPackage, app, auth, db, io) {
  var newsletterController = require('../controllers/newsletter')(io)

  app.route('/api/newsletter/current')
  .get(newsletterController.current)

  app.route('/api/newsletter')
  .get(newsletterController.list)

  app.route('/api/newsletter/:id')
  .put(newsletterController.update)

  app.route('/api/newsletter/upload')
  .post(newsletterController.upload)
}
