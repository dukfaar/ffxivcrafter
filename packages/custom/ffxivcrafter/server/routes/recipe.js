'use strict';

module.exports = function(myPackage,app,auth,db) {
  var recipeController=require('../controllers/recipe')();

  app.route('/api/recipe')
  .get(recipeController.list);

  app.route('/api/recipe')
  .post(recipeController.create);

  app.route('/api/recipe/:id')
  .get(recipeController.get);

  app.route('/api/recipe/:id')
  .delete(recipeController.delete);

  app.route('/api/recipe/:id')
  .put(recipeController.update);
}
