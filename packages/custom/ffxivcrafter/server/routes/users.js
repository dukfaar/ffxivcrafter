'use strict';

module.exports = function(myPackage,app,auth,db) {
  var userController=require('../controllers/users')();

  app.route('/api/users')
  .get(userController.list);
}
