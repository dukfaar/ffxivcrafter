'use strict';

angular.module('mean.system').controller('ItemImportDialogController', ['$scope', 'Global','$http', '$mdDialog',
  function($scope, Global,$http, $mdDialog) {
    $scope.importText='';

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.import=function() {
      var postData={};
      postData.importText=$scope.importText;

      $http.post('/api/item/importList',postData)
      .then(function(response) {
        $mdDialog.hide();
      });
    };

  }
]);
