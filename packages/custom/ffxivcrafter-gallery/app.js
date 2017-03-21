'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterGallery = new Module('ffxivCrafter_gallery')

function setupCircles (circles) {
  circles.registerCircle('see gallery', ['admin'])
}

function setupMenus () {
  FFXIVCrafterGallery.menus.add({
    title: 'Gallery',
    link: 'gallery index',
    roles: ['see gallery'],
    menu: 'main',
    weight: 4
  })
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterGallery.register(function (app, users, system, database, circles, ffxivCrafter_io) {
  FFXIVCrafterGallery.routes(app, users, system, ffxivCrafter_io.io)

  setupMenus()

  setupCircles(circles)

  FFXIVCrafterGallery.angularDependencies([])

  return FFXIVCrafterGallery
})
