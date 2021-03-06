'use strict';

module.exports = function(myPackage,app,auth,db, io) {
  var recipeController=require('../controllers/recipe')(io)

  app.route('/api/recipe')
  .get(recipeController.list)

  app.route('/api/recipe/filteredList/:q')
  .get(recipeController.filteredList)

  app.route('/api/recipe')
  .post(recipeController.create)

  app.route('/api/recipe/:id')
  .get(recipeController.get)

  app.route('/api/recipe/:id')
  .delete(recipeController.delete)

  app.route('/api/recipe/:id')
  .put(recipeController.update)

  app.route('/api/recipe/by_output/:id')
  .get(recipeController.findByOutput)

  app.route('/api/recipe/xivdbImport/:id')
  .post(recipeController.xivdbImport)

  app.route('/api/import/recipe')
  .get(recipeController.fullXivdbImport)

  app.route('/api/importnoOW/recipe')
  .get(recipeController.xivdbImportNoOverwrite)
}
