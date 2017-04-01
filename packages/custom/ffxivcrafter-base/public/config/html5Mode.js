'use strict'

angular.module('mean.ffxivCrafter_base').config(Html5ModeConfig)

Html5ModeConfig.$inject = ['$locationProvider']

function Html5ModeConfig ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  })
}
