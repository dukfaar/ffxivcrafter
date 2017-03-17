'use strict'

var Module = require('meanio').Module

var FFXIVCrafterBase = new Module('ffxivCrafter_base')

FFXIVCrafterBase.register(function () {
  FFXIVCrafterBase.angularDependencies([
    'mean.users'
  ])

  return FFXIVCrafterBase
})
