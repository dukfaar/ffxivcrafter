'use strict'

angular.module('mean.ffxivCrafter').directive('adminUsers', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/users.html',
    scope: {
    },
    controller: AdminUsers
  }
})

AdminUsers.$inject = [ '$scope', '$q', '_', 'UserService', 'User', 'Circle']

function AdminUsers ($scope, $q, _, UserService, User, Circle) {
  $scope.UserService = UserService
  $scope.users = User.query({})
  $scope.circles = Circle.query({})
}
