'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafter = new Module('ffxivCrafter')

var mongoose = require('mongoose')
var Schema = mongoose.Schema

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

  circles.registerCircle('use inventory', ['admin'])

  circles.registerCircle('see order', ['admin'])

  circles.registerCircle('edit users', ['admin'])
  circles.registerCircle('edit user permissions', ['edit users'])

  circles.registerCircle('edit circles', ['admin'])

  circles.registerCircle('see admin dashboard', ['admin'])

  circles.registerCircle('see all projects', ['admin'])

  circles.registerCircle('edit newspage', ['admin'])
}

function setupMainMenu_PM () {
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
}

function setupMainMenu_Crafting () {
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
}

function setupMainMenu_AppManagement () {
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
}

function setupMainMenu_Admin () {
  FFXIVCrafter.menus.add({
    title: 'Admin',
    roles: ['authenticated'],
    path: 'main',
    name: 'admin'
  })
  FFXIVCrafter.menus.add({
    title: 'Dashboard',
    link: 'admin dashboard',
    roles: ['see admin dashboard'],
    path: 'main/admin'
  })
  FFXIVCrafter.menus.add({
    title: 'User Permissions',
    link: 'admin edit users',
    roles: ['edit user permissions'],
    path: 'main/admin'
  })
  FFXIVCrafter.menus.add({
    title: 'Circles',
    link: 'admin edit circles',
    roles: ['edit circles'],
    path: 'main/admin'
  })

  FFXIVCrafter.menus.add({
    title: 'All Projects',
    link: 'admin projects',
    roles: ['see all projects'],
    path: 'main/admin'
  })

  FFXIVCrafter.menus.add({
    title: 'News Settings',
    link: 'admin news',
    roles: ['edit newspage'],
    path: 'main/admin'
  })
}

function setupMainMenu () {
  FFXIVCrafter.menus.add({
    title: 'Index',
    link: 'home',
    roles: ['authenticated'],
    menu: 'main',
    weight: 1
  })

  setupMainMenu_PM()

  setupMainMenu_Crafting()

  setupMainMenu_AppManagement()

  /* FFXIVCrafter.menus.add({
    title: 'Airship',
    link: 'airship home',
    roles: ['manage airships'],
    menu: 'main'
  }) */

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

  /* FFXIVCrafter.menus.add({
    title: 'Hidden',
    roles: ['authenticated'],
    path: 'main',
    name: 'hidden'
  }) */
  /* FFXIVCrafter.menus.add({
    title: 'Buy & Sell',
    link: 'market home',
    roles: ['see market'],
    path: 'main/hidden'
  }) */

  setupMainMenu_Admin()
}

function setupAccountMenu () {
  FFXIVCrafter.menus.add({
    title: 'Level Settings',
    link: 'doldoh config',
    roles: ['authenticated'],
    menu: 'account'
  })

  FFXIVCrafter.menus.add({
    title: 'Account Settings',
    link: 'account settings',
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

function setupMenus () {
  setupMainMenu()
  setupAccountMenu()
}

function extendUser (database) {
  var UserModel = database.connection.model('User')
  UserModel.schema.add({
    avatarImage: { type: Schema.ObjectId, ref: 'Image' },
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
FFXIVCrafter.register(function (app, users, system, admin, database, circles, http, ffxivCrafter_io, ffxivCrafter_forum, ffxivCrafter_calendar, ffxivCrafter_base, ffxivCrafter_gallery, ffxivCrafter_newsletter) {
  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views')

  FFXIVCrafter.routes(app, users, system, ffxivCrafter_io.io)

  setupMenus()

  extendUser(database)

  FFXIVCrafter.angularDependencies([
    'mean.system', 'mean.users', 'mean.admin',
    'mean.ffxivCrafter_forum', 'mean.ffxivCrafter_gallery',
    'mean.ffxivCrafter_io', 'mean.ffxivCrafter_calendar',
    'mean.ffxivCrafter_base', 'mean.ffxivCrafter_newsletter',
    'LocalStorageModule', 'chart.js',
    'dndLists', 'pascalprecht.translate', 'angular-web-notification'
  ])

  setupCircles(circles)

  var glob = require('glob')
  var path = require('path')

  glob.sync(__dirname + '/server/jobs/**/*.js').forEach(function (file) {
    require(path.resolve(file))
  })

  return FFXIVCrafter
})
