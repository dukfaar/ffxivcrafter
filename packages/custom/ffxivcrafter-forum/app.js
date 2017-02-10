'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterForum = new Module('ffxivCrafter_forum')

function setupCircles (circles) {
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
  FFXIVCrafterForum.menus.add({
    title: 'Forum',
    link: 'forum index',
    roles: ['see forum'],
    menu: 'main',
    weight: 2
  })
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterForum.register(function (app, users, system, database, circles, ffxivCrafter_io) {
  FFXIVCrafterForum.routes(app, users, system, ffxivCrafter_io.io)

  setupMenus()

  setupCircles(circles)

  FFXIVCrafterForum.angularDependencies([])

  return FFXIVCrafterForum
})
