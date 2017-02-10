'use strict'

var Module = require('meanio').Module

var FFXIVCrafterCalendar = new Module('ffxivCrafter_calendar')

function setupCircles (circles) {
  circles.registerCircle('see calendar', ['admin'])
  circles.registerCircle('create events', ['admin'])
}

function setupMenus () {
  FFXIVCrafterCalendar.menus.add({
    title: 'Calendar',
    link: 'events calendar',
    roles: ['see calendar'],
    menu: 'main',
    weight: 3
  })
}

FFXIVCrafterCalendar.register(function (app, users, system, database, circles, ffxivCrafter_io) {
  FFXIVCrafterCalendar.routes(app, users, system, ffxivCrafter_io.io)

  setupMenus()

  setupCircles(circles)

  FFXIVCrafterCalendar.angularDependencies([])

  return FFXIVCrafterCalendar
})
