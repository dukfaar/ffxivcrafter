'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterBot = new Module('ffxivCrafter_bot')

function setupCircles (circles) {
  circles.registerCircle('edit botreactions', ['admin'])
}

function setupMenus () {
  FFXIVCrafterBot.menus.add({
    title: 'Bot',
    link: 'botreaction index',
    roles: ['edit botreactions'],
    menu: 'main',
    name: 'bot'
  })
}


/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterBot.register(function (app, users, system, circles, ffxivCrafter_gallery, ffxivCrafter_io) {
  FFXIVCrafterBot.routes(app, users, system, ffxivCrafter_io.io)

  require(__dirname + '/server/bot')(ffxivCrafter_io.io)

  setupCircles(circles)
  setupMenus()

  FFXIVCrafterBot.angularDependencies(['mean.ffxivCrafter_base', 'mean.system', 'pascalprecht.translate'])

  return FFXIVCrafterBot
})
