'use strict'

angular.module('mean.ffxivCrafter').controller('UserList', UserListController)

UserListController.$inject = ['$scope', 'User', 'socket']

function UserListController ($scope, User, socket) {
  let vm = this
  this.users = []

  updateUserList()

  socket.auto('User created', updateUserList, $scope)
  socket.auto('User deleted', updateUserList, $scope)
  socket.auto('User updated', updateUserList, $scope)

  function updateUserList () {
    User.query({}).$promise.then(result => { vm.users = result })
  }
}
