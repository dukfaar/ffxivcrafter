'use strict';

module.exports = function(myPackage,app,auth,db) {
  var projectController=require('../controllers/project')();

  app.route('/api/project')
  .get(projectController.list);

  app.route('/api/project/public')
  .get(projectController.publicList);

  app.route('/api/project/fromItem/:id/:amount')
  .post(projectController.fromItem);

  app.route('/api/project/stock/add/:projectId/:itemId/:amount')
  .post(projectController.addToStock);

  app.route('/api/project/stock/set/:projectId/:itemId/:amount')
  .post(projectController.setStock);

  app.route('/api/project/:id')
  .put(projectController.update);

  app.route('/api/project/:id')
  .delete(projectController.delete);
}
