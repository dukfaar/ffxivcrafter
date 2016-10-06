'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterAI = new Module('ffxivCrafter-ai')

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterAI.register(function (app, users, system, admin, database, circles, http) {

  return FFXIVCrafterAI
})
