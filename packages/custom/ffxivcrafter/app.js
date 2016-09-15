'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var FFXIVCrafter = new Module('ffxivCrafter');

function setupCircles(circles) {
  circles.registerCircle('projectManager',['admin']);

  circles.registerCircle('manage items',['admin']);
  circles.registerCircle('see items',['manage items']);
  circles.registerCircle('edit itemdata',['manage items']);
  circles.registerCircle('edit itemprices',['manage items']);
  circles.registerCircle('create items',['manage items']);
  circles.registerCircle('delete items',['manage items']);

  circles.registerCircle('manage recipes',['admin']);
  circles.registerCircle('see recipes',['manage recipes']);

  circles.registerCircle('manage crafting',['projectManager']);
  circles.registerCircle('see crafting',['manage crafting']);

  circles.registerCircle('manage projects',['projectManager']);
  circles.registerCircle('see projects',['manage projects']);

  circles.registerCircle('see public tasks',['admin']);
  circles.registerCircle('see public craft tasks',['see public tasks']);
  circles.registerCircle('see public gather tasks',['see public tasks']);
}

function setupMenus() {
  FFXIVCrafter.menus.add({
    title:'Order',
    link:'order home',
    roles:['authenticated'],
    menu:'main'
  });

  FFXIVCrafter.menus.add({
    title:'Market',
    link:'market home',
    roles:['authenticated'],
    menu:'main'
  });

  FFXIVCrafter.menus.add({
    title:'ItemList',
    link:'item list',
    roles:['see items'],
    menu:'main'
  });
  FFXIVCrafter.menus.add({
    title:'RecipeList',
    link:'recipe list',
    roles:['see recipes'],
    menu:'main'
  });
  FFXIVCrafter.menus.add({
    title:'Crafting',
    link:'crafting home',
    roles:['see crafting'],
    menu:'main'
  });
  FFXIVCrafter.menus.add({
    title:'Projects',
    link:'project list',
    roles:['see projects'],
    menu:'main'
  });

  FFXIVCrafter.menus.add({
    title:'Level Settings',
    link:'doldoh config',
    roles:['authenticated'],
    menu:'account'
  });
}

function extendUser(database) {
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
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafter.register(function(app, users, system, admin, database, circles) {
  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  FFXIVCrafter.routes(app,users,system);

  setupMenus();

  extendUser(database);

  FFXIVCrafter.angularDependencies(['mean.system', 'mean.users', 'mean.admin', 'ngMaterial']);

  setupCircles(circles);

  return FFXIVCrafter;
});
