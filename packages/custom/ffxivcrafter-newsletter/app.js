'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterNewsletter = new Module('ffxivCrafter_newsletter')

function setupCircles (circles) {
  circles.registerCircle('see newsletter', ['admin'])
  circles.registerCircle('see newsletter archive', ['admin'])
  circles.registerCircle('manage newsletter', ['admin'])
}

function setupMenus () {
  FFXIVCrafterNewsletter.menus.add({
    title: 'Newsletter',
    link: 'newsletter index',
    roles: ['see newsletter'],
    menu: 'main',
    name: 'newsletter',
    weight: 6
  })
  FFXIVCrafterNewsletter.menus.add({
    title: 'Newsletter Archive',
    link: 'newsletter archive',
    roles: ['see newsletter archive'],
    menu: 'main/newsletter'
  })
  FFXIVCrafterNewsletter.menus.add({
    title: 'Manage Newsletter',
    link: 'newsletter manage',
    roles: ['manage newsletter'],
    menu: 'main/newsletter'
  })
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterNewsletter.register(function (app, users, system, circles, ffxivCrafter_io) {
  FFXIVCrafterNewsletter.routes(app, users, system, ffxivCrafter_io.io)

  setupMenus()

  setupCircles(circles)

  FFXIVCrafterNewsletter.angularDependencies(['pdf-viewer', 'mean.ffxivCrafter_base', 'mean.system'])

  return FFXIVCrafterNewsletter
})
