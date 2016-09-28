'use strict'

angular.module('mean.ffxivCrafter')
  .filter('encodeURIComponent', function () {
    return window.encodeURIComponent
  })
