'use strict'

module.exports = function (myPackage, app, auth, db, io) {
  var projectController = require('../controllers/project')(io)

  app.route('/api/project')
    .get(projectController.list)

  app.route('/api/project/public')
    .get(projectController.publicList)

  app.route('/api/project/fromItem/:id/:amount')
    .post(projectController.fromItem)

  app.route('/api/project/fromTemplate')
    .post(projectController.fromTemplate)

  app.route('/api/project/addToProject/:id/:amount/:projectId')
    .post(projectController.addToProject)

  app.route('/api/project/merge/:id1/:id2')
    .get(projectController.merge)

  app.route('/api/project/stock/add/:projectId/:itemId/:amount/:hq')
    .post(projectController.addToStock)

  app.route('/api/project/:id')
    .put(projectController.update)

  app.route('/api/project/:id')
    .get(projectController.get)

  app.route('/api/project/notes/:id')
    .put(projectController.update)

  app.route('/api/project/:id')
    .delete(projectController.delete)
}
