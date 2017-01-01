'use strict'

angular.module('mean.ffxivCrafter').directive('pageBase', function () {
  return {
    transclude: true,
    replace: true,
    template: '<div flex><main style="overflow:auto"><div flex><md-content ng-transclude></md-content></div></main></div>'
  }
})
