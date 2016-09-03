'use strict';

module.exports = function(myPackage,app,auth,db) {
  var doldoh=require('../controllers/doldoh')();

  app.route('/api/doldoh')
  .put(doldoh.update);
}
