'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var MeanStarter = new Module('meanStarter');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
MeanStarter.register(function(app, users, system) {

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  MeanStarter.routes(app,users,system);

  MeanStarter.menus.add({
    title:'ItemList',
    link:'item list',
    roles:['see items'],
    menu:'main'
  });
  MeanStarter.menus.add({
    title:'RecipeList',
    link:'recipe list',
    roles:['see recipes'],
    menu:'main'
  });
  MeanStarter.menus.add({
    title:'Crafting',
    link:'crafting home',
    roles:['see crafting'],
    menu:'main'
  });
  MeanStarter.menus.add({
    title:'Projects',
    link:'project list',
    roles:['see projects'],
    menu:'main'
  });

  MeanStarter.angularDependencies(['mean.system', 'mean.users','ngMaterial']);

  return MeanStarter;
});
