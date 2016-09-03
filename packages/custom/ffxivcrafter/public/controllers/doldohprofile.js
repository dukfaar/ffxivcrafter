'use strict';

angular.module('mean.system').controller('DoLDoHProfileController', ['$scope', 'Global', '$http', '$mdDialog', 'MeanUser',
  function($scope, Global, $http, $mdDialog, MeanUser) {
    $scope.user=MeanUser;

    $scope.updateLevels=function() {
      $http.put('/api/doldoh',$scope.user.user)
      .then(function(response) {
      });
    };
  }
]);
