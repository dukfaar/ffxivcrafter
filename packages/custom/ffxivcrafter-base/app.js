'use strict'

var Module = require('meanio').Module

var FFXIVCrafterBase = new Module('ffxivCrafter_base')

require('./server/config/logging')

FFXIVCrafterBase.register(function () {
  FFXIVCrafterBase.angularDependencies([
    'mean.users', 'ngResource', 'ngMaterial', 'ngFileUpload'
  ])

  return FFXIVCrafterBase
})
