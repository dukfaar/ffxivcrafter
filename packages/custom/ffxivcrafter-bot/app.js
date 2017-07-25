'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterBot = new Module('ffxivCrafter_bot')

function setupCircles (circles) {
  circles.registerCircle('edit botreactions', ['admin'])
  circles.registerCircle('edit uselessfacts', ['admin'])
}

function setupMenus () {
  FFXIVCrafterBot.menus.add({
    title: 'Bot',
    menu: 'main',
    roles: ['authenticated'],
    name: 'bot'
  })

  FFXIVCrafterBot.menus.add({
    title: 'Reactions',
    link: 'botreaction index',
    roles: ['edit botreactions'],
    path: 'main/bot'
  })

  FFXIVCrafterBot.menus.add({
    title: 'Useless Facts',
    link: 'uselessfacts index',
    roles: ['edit uselessfacts'],
    menu: 'main/bot'
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
