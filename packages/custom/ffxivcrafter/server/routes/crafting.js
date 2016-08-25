'use strict';

module.exports = function(myPackage,app,auth,db) {
  var craftingController=require('../controllers/crafting')();

  app.route('/api/crafting/:id')
  .get(craftingController.craftItem);
}
