'use strict';

module.exports = function(myPackage,app,auth,db,io) {
  var stepController=require('../controllers/projectStep')(io);

  app.route('/api/projectstep')
  .get(stepController.list);

  app.route('/api/projectstep')
  .post(stepController.create);

  app.route('/api/projectstep/:id')
  .get(stepController.get);

  app.route('/api/projectstep/:id')
  .delete(stepController.delete);

  app.route('/api/projectstep/:id')
  .put(stepController.update);
}
