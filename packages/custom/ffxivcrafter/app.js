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
MeanStarter.register(function(app, users, system, database) {

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  MeanStarter.routes(app,users,system);

  MeanStarter.menus.add({
    title:'Order',
    link:'order home',
    roles:['authenticated'],
    menu:'main'
  });

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

  MeanStarter.menus.add({
    title:'Level Settings',
    link:'doldoh config',
    roles:['authenticated'],
    menu:'account'
  });

  var UserModel = database.connection.model('User');
  UserModel.schema.add({
    minerLevel: { type: Number, min:1, max: 60, default: 1 },
    botanistLevel: { type: Number, min:1, max: 60, default: 1 },
    weaverLevel: { type: Number, min:1, max: 60, default: 1 },
    culinarianLevel: { type: Number, min:1, max: 60, default: 1 },
    alchimistLevel: { type: Number, min:1, max: 60, default: 1 },
    blacksmithLevel: { type: Number, min:1, max: 60, default: 1 },
    carpenterLevel: { type: Number, min:1, max: 60, default: 1 },
    armorerLevel: { type: Number, min:1, max: 60, default: 1 },
    goldsmithLevel: { type: Number, min:1, max: 60, default: 1 },
    leatherworkerLevel: { type: Number, min:1, max: 60, default: 1 }
  });

  MeanStarter.angularDependencies(['mean.system', 'mean.users','ngMaterial']);

  return MeanStarter;
});
