'use strict'

module.exports = function(myPackage,app,auth,db) {
  var airshipPartController = require('../controllers/airshipPart')()

  app.route('/api/airshipPart')
  .get(airshipPartController.list)

  app.route('/api/airshipPart')
  .post(airshipPartController.create)

  app.route('/api/airshipPart/:id')
  .get(airshipPartController.get)

  app.route('/api/airshipPart/:id')
  .delete(airshipPartController.delete)

  app.route('/api/airshipPart/:id')
  .put(airshipPartController.update)
}
