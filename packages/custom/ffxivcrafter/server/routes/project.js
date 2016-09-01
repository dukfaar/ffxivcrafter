'use strict';

module.exports = function(myPackage,app,auth,db) {
  var projectController=require('../controllers/project')();

  app.route('/api/project')
  .get(projectController.list);

  app.route('/api/project/fromItem/:id')
  .post(projectController.fromItem);

  app.route('/api/project/stock/add/:projectId/:itemId/:amount')
  .post(projectController.addToStock);
}
