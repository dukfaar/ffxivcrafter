'use strict'

angular.module('mean.ffxivCrafter').directive('customDirectiveContainerAdder', function ($compile, localStorageService, _) {
  return {
    restrict: 'E',
    require: '^^rcCustomDirectiveContainer',
    templateUrl: '/ffxivCrafter/views/system/customDirectiveContainerAdder.html',
    link: function (scope, element, attrs, containerCtrl) {
      scope.containerCtrl = containerCtrl
    }
  }
})
