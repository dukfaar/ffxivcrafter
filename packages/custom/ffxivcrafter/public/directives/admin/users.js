'use strict'

angular.module('mean.ffxivCrafter').directive('adminUsers', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/users.html',
    scope: {
    },
    controller: AdminUsers
  }
})

AdminUsers.$inject = ['$scope', '$q', '_', 'UserService', 'User', 'Circle']

function AdminUsers ($scope, $q, _, UserService, User, Circle) {
  $scope.UserService = UserService
  $scope.circles = Circle.query({})
  $scope.auto = {}
  $scope.editableCircles = editableCircles

  $scope.updateUserRoles = function (user) {
    User.update({id: user._id}, user)
  }

  function editableCircles (searchText) {
    return _.filter(_.filter(_.map($scope.circles, c => c.name), c => UserService.allowed(c)), c => _.includes(c, searchText))
  }
}
