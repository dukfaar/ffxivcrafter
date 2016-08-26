'use strict';

module.exports = function(myPackage,app,auth,db) {
  var itemController=require('../controllers/item')();

  app.route('/api/item')
  .get(itemController.list);

  app.route('/api/item/filteredList/:q')
  .get(itemController.filteredList);

  app.route('/api/item')
  .post(itemController.create);

  app.route('/api/item/:id')
  .get(itemController.get);

  app.route('/api/item/:id')
  .delete(itemController.delete);

  app.route('/api/item/:id')
  .put(itemController.update);
}
