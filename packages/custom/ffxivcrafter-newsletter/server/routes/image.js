'use strict';

module.exports = function(myPackage,app,auth,db, io) {
  var newsletterController=require('../controllers/newsletter')(io);

  app.route('/api/newsletter/current')
  .get(newsletterController.current)
}
