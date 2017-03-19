'use strict'

angular.module('mean.ffxivCrafter_base').directive('pageBase', function () {
  return {
    transclude: true,
    replace: true,
    template: '<div flex><main><div><md-content style="overflow: visible" ng-transclude></md-content></div></main></div>'
  }
})
