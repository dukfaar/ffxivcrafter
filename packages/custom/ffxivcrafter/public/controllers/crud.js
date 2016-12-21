'use strict'

angular.module('mean.ffxivCrafter').controller('CrudController', ['$scope', 'Global', '$http', '$mdDialog', 'MeanUser', '$stateParams',
  function ($scope, Global, $http, $mdDialog, MeanUser, $stateParams) {
    $scope.user = MeanUser
    $scope.allowed = function (perm) {
      return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
    }

    $scope.schema = {}
    $http.get('/api/schema/' + $stateParams.modelName)
    .then(function (response) {
      $scope.schema = response.data
    })

    $scope.data = []
    $http.get('api/crud/'+ $stateParams.modelName, {params: {page: 0, limit:10}})
    .then(function (response) {
      $scope.data = response.data
    })
  }
])
