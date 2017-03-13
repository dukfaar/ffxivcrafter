'use strict';

module.exports = function(myPackage,app,auth,db, io) {
  var craftingController=require('../controllers/image')(io);

  app.route('/api/image/')
  .get(craftingController.list)

  app.route('/api/image/:id')
  .get(craftingController.get)

  app.route('/api/imageData/:id')
  .get(craftingController.getImageData)

  app.route('/api/image')
  .post(craftingController.create)

  app.route('/api/image/:id')
  .delete(craftingController.delete)

  app.route('/api/image/:id')
  .put(craftingController.update)
}
