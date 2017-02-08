'use strict'

angular.module('mean.ffxivCrafter').directive('adminUsers', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/users.html',
    scope: {
    },
    controller: [
      '$scope', '$q', '_', 'UserService', 'User',
      function ($scope, $q, _, UserService, User) {
        $scope.UserService = UserService
        $scope.users = User.query({})
      }
    ]
  }
})
