'use strict'

angular.module('mean.ffxivCrafter').directive('column', function () {
  return {
    transclude: true,
    replace: true,
    template: '<div layout="column" flex="25" flex-xs="100" flex-sm="50" ng-transclude></div>'
  }
})

angular.module('mean.ffxivCrafter').directive('columnLayout', function () {
  return {
    transclude: true,
    replace: true,
    template: '<div layout-wrap flex layout="row" layout-xs="column" layout-sm="row" ng-transclude></div>'
  }
})
