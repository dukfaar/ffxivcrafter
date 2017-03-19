'use strict'

angular.module('mean.ffxivCrafter_base')
.directive('columnLayout',function () {
  return {
    transclude: true,
    replace: true,
    templateUrl: '/ffxivCrafter_base/views/layout/columnLayout.html',
  }
})
