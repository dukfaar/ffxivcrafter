'use strict'

angular.module('mean.ffxivCrafter_base')
.directive('pageBase', function () {
  return {
    transclude: true,
    replace: true,
    templateUrl: '/ffxivCrafter_base/views/layout/pageBase.html'
  }
})
