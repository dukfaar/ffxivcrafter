'use strict';

module.exports = function(myPackage,app,auth,db, io) {
  var imageController=require('../controllers/image')(io);

  app.route('/api/image/')
  .get(imageController.list)

  app.route('/api/image/count')
  .get(imageController.count)

  app.route('/api/image/:id')
  .get(imageController.get)

  app.route('/api/imageData/:id')
  .get(imageController.getImageData)
  app.route('/api/imageThumbnailData/:id')
  .get(imageController.getImageThumbnailData)

  app.route('/api/image')
  .post(imageController.create)

  app.route('/api/image/:id')
  .delete(imageController.delete)

  app.route('/api/image/:id')
  .put(imageController.update)
}
