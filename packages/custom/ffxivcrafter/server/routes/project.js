'use strict';

module.exports = function(myPackage,app,auth,db) {
  var projectController=require('../controllers/project')();

  app.route('/api/project')
  .get(projectController.list);

  app.route('/api/project')
  .post(projectController.create);

  app.route('/api/project/:id')
  .get(projectController.get);

  app.route('/api/project/:id')
  .delete(projectController.delete);

  app.route('/api/project/:id')
  .put(projectController.update);
}
