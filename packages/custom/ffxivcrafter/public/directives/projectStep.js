'use strict';

angular.module('mean.ffxivCrafter').directive('projectStep',function() {
  return {
    templateUrl:'/ffxivCrafter/views/project/projectStep.html',
    scope: {
      step: '=',
      updateStep: '&'
    },
    controller:function($scope) {
      $scope.update=function() {
        $scope.updateStep()($scope.step);
      };
    }
  };
});
