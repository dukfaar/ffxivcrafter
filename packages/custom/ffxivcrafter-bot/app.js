'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterBot = new Module('ffxivCrafter_bot')

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterBot.register(function (app, ffxivCrafter, ffxivCrafter_gallery, ffxivCrafter_io) {
  require(__dirname + '/server/bot')(ffxivCrafter_io.io)

  return FFXIVCrafterBot
})
