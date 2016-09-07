'use strict';

angular.module('mean.system').directive('projectStep',function() {
  return {
    templateUrl:'/meanStarter/views/project/projectStep.html',
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
