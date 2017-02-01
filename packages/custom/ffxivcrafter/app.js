'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafter = new Module('ffxivCrafter')

function setupCircles (circles) {
  circles.registerCircle('projectManager', ['admin'])

  circles.registerCircle('see kanban board', ['admin'])

  circles.registerCircle('manage items', ['admin'])
  circles.registerCircle('see items', ['manage items'])
  circles.registerCircle('edit itemdata', ['manage items'])
  circles.registerCircle('edit itemprices', ['manage items'])
  circles.registerCircle('create items', ['manage items'])
  circles.registerCircle('delete items', ['manage items'])

  circles.registerCircle('manage recipes', ['admin'])
  circles.registerCircle('see recipes', ['manage recipes'])

  circles.registerCircle('manage crafting', ['projectManager'])
  circles.registerCircle('see crafting', ['manage crafting'])

  circles.registerCircle('manage projects', ['projectManager'])
  circles.registerCircle('see projects', ['manage projects'])

  circles.registerCircle('see public tasks', ['admin'])
  circles.registerCircle('see public craft tasks', ['see public tasks'])
  circles.registerCircle('see public gather tasks', ['see public tasks'])

  circles.registerCircle('see market', ['admin'])
  circles.registerCircle('see order', ['admin'])

  circles.registerCircle('manage airships', ['admin'])

  circles.registerCircle('use inventory', ['authenticated'])

  circles.registerCircle('see order', ['basic user'])

  circles.registerCircle('see calendar', ['admin'])
  circles.registerCircle('create events', ['admin'])

  circles.registerCircle('see forum', ['admin'])
  circles.registerCircle('create categories', ['admin'])
  circles.registerCircle('create threads', ['admin'])
  circles.registerCircle('create forum posts', ['admin'])
  circles.registerCircle('edit categories', ['admin'])
  circles.registerCircle('edit threads', ['admin'])
  circles.registerCircle('edit forum posts', ['admin'])
  circles.registerCircle('delete categories', ['admin'])
  circles.registerCircle('delete threads', ['admin'])
  circles.registerCircle('delete forum posts', ['admin'])
}

function setupMenus () {
  FFXIVCrafter.menus.add({
    title: 'Delivery',
    link: 'home',
    roles: ['authenticated'],
    menu: 'main'
  })
  FFXIVCrafter.menus.add({
    title: 'Calendar',
    link: 'events calendar',
    roles: ['see calendar'],
    menu: 'main'
  })

  FFXIVCrafter.menus.add({
    title: 'Forum',
    link: 'forum index',
    roles: ['see forum'],
    menu: 'main'
  })

  FFXIVCrafter.menus.add({
    title: 'Project Manager',
    roles: ['projectManager'],
    menu: 'main',
    name: 'pm'
  })
  FFXIVCrafter.menus.add({
    title: 'Overview',
    link: 'pm overview',
    roles: ['projectManager'],
    path: 'main/pm'
  })
  FFXIVCrafter.menus.add({
    title: 'Kanban',
    link: 'pm kanban',
    roles: ['see kanban board'],
    path: 'main/pm'
  })
  FFXIVCrafter.menus.add({
    title: 'Public Projects',
    link: 'pm project public',
    roles: ['projectManager'],
    path: 'main/pm'
  })
  FFXIVCrafter.menus.add({
    title: 'Orders',
    link: 'pm project order',
    roles: ['projectManager'],
    path: 'main/pm'
  })

  FFXIVCrafter.menus.add({
    title: 'Crafting',
    roles: ['authenticated'],
    menu: 'main',
    name: 'crafting'
  })
  FFXIVCrafter.menus.add({
    title: 'Project Creation',
    link: 'crafting home',
    roles: ['see crafting'],
    path: 'main/crafting'
  })
  FFXIVCrafter.menus.add({
    title: 'Projects',
    link: 'project private',
    roles: ['see projects'],
    path: 'main/crafting'
  })

  FFXIVCrafter.menus.add({
    title: 'Reporting',
    link: 'crafting reporting',
    roles: ['projectManager'],
    path: 'main/crafting'
  })

  FFXIVCrafter.menus.add({
    title: 'App Management',
    roles: ['authenticated'],
    path: 'main',
    name: 'manage'
  })
  FFXIVCrafter.menus.add({
    title: 'Items',
    link: 'item list',
    roles: ['see items'],
    path: 'main/manage'
  })
  FFXIVCrafter.menus.add({
    title: 'Recipes',
    link: 'recipe list',
    roles: ['see recipes'],
    path: 'main/manage'
  })

  /*FFXIVCrafter.menus.add({
    title: 'Airship',
    link: 'airship home',
    roles: ['manage airships'],
    menu: 'main'
  })*/

  FFXIVCrafter.menus.add({
    title: 'Inventory',
    link: 'inventory index',
    roles: ['use inventory'],
    menu: 'main'
  })

  FFXIVCrafter.menus.add({
    title: 'Market',
    roles: ['authenticated'],
    path: 'main',
    name: 'market'
  })
  FFXIVCrafter.menus.add({
    title: 'Order',
    link: 'order home',
    roles: ['see order'],
    path: 'main/market'
  })

  /*FFXIVCrafter.menus.add({
    title: 'Hidden',
    roles: ['authenticated'],
    path: 'main',
    name: 'hidden'
  })*/
  /*FFXIVCrafter.menus.add({
    title: 'Buy & Sell',
    link: 'market home',
    roles: ['see market'],
    path: 'main/hidden'
  })*/

  FFXIVCrafter.menus.add({
    title: 'Level Settings',
    link: 'doldoh config',
    roles: ['authenticated'],
    menu: 'account'
  })

  FFXIVCrafter.menus.add({
    title: 'Theme Settings',
    link: 'theme settings',
    roles: ['authenticated'],
    menu: 'account'
  })

  FFXIVCrafter.menus.add({
    title: 'DoLDoH Overview',
    link: 'doldoh overview',
    roles: ['projectManager'],
    menu: 'account'
  })

  FFXIVCrafter.menus.add({
    title: 'Project Settings',
    link: 'project settings',
    roles: ['authenticated'],
    menu: 'account'
  })

  FFXIVCrafter.menus.add({
    title: 'Notification Settings',
    link: 'notification settings',
    roles: ['authenticated'],
    menu: 'account'
  })
}

function extendUser (database) {
  var UserModel = database.connection.model('User')
  UserModel.schema.add({
    minerLevel: { type: Number, min: 1, max: 60, default: 1 },
    minerFolklore: {
      coerthas: { type: Boolean, default: false },
      dravania: { type: Boolean, default: false },
      abalathia: { type: Boolean, default: false }
    },

    botanistLevel: { type: Number, min: 1, max: 60, default: 1 },
    botanistFolklore: {
      coerthas: { type: Boolean, default: false },
      dravania: { type: Boolean, default: false },
      abalathia: { type: Boolean, default: false }
    },

    weaverLevel: { type: Number, min: 1, max: 60, default: 1 },
    weaverSpecialist: { type: Boolean, default: false },
    weaverMaster: [Boolean],

    culinarianLevel: { type: Number, min: 1, max: 60, default: 1 },
    culinarianSpecialist: { type: Boolean, default: false },
    culinarianMaster: [Boolean],

    alchimistLevel: { type: Number, min: 1, max: 60, default: 1 },
    alchimistSpecialist: { type: Boolean, default: false },
    alchimistMaster: [Boolean],

    blacksmithLevel: { type: Number, min: 1, max: 60, default: 1 },
    blacksmithSpecialist: { type: Boolean, default: false },
    blacksmithMaster: [Boolean],

    carpenterLevel: { type: Number, min: 1, max: 60, default: 1 },
    carpenterSpecialist: { type: Boolean, default: false },
    carpenterMaster: [Boolean],

    armorerLevel: { type: Number, min: 1, max: 60, default: 1 },
    armorerSpecialist: { type: Boolean, default: false },
    armorerMaster: [Boolean],

    goldsmithLevel: { type: Number, min: 1, max: 60, default: 1 },
    goldsmithSpecialist: { type: Boolean, default: false },
    goldsmithMaster: [Boolean],

    leatherworkerLevel: { type: Number, min: 1, max: 60, default: 1 },
    leatherworkerSpecialist: { type: Boolean, default: false },
    leatherworkerMaster: [Boolean]
  })
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafter.register(function (app, users, system, admin, database, circles, http) {
  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views')

  var io = require('./server/config/socket')(http)

  FFXIVCrafter.io = io

  io.sockets.on('connection', function (socket) {
    console.log('Client Connected')

    socket.on('disconnect', function (socket) {
      console.log('Client Disconnected')
    })

    socket.on('error', function (err) {
      console.log('Error with socket:')
      console.log(err)
    })
  })

  FFXIVCrafter.routes(app, users, system, io)

  setupMenus()

  extendUser(database)

  FFXIVCrafter.angularDependencies(['mean.system', 'mean.users', 'mean.admin', 'ngMaterial', 'LocalStorageModule', 'ngResource', 'chart.js', 'dndLists', 'pascalprecht.translate', 'angular-web-notification'])

  setupCircles(circles)

  return FFXIVCrafter
})
