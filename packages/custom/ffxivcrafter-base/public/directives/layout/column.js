'use strict'

angular.module('mean.ffxivCrafter_base')
.directive('column', function () {
  return {
    transclude: true,
    replace: true,
    templateUrl: '/ffxivCrafter_base/views/layout/column.html'
  }
})
