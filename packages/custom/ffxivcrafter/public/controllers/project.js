'use strict';

angular.module('mean.system').controller('ProjectController', ['$scope', 'Global','$http', '$mdDialog',
  function($scope, Global,$http, $mdDialog) {
    $scope.projectList=[];

    $scope.updateList=function() {
      var url='/api/project';

      $http.get(url)
      .then(function(response) {
        $scope.projectList=response.data;
      });
    };

    $scope.createProject=function() {
      $http.post('/api/project')
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.updateList();
  }
]);
