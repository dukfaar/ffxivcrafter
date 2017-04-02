'use strict'

angular.module('mean.ffxivCrafter').controller('MemberList', MemberListController)

MemberListController.$inject = ['$scope', 'User', 'socket']

function MemberListController ($scope, User, socket) {
  let vm = this
  this.users = []

  updateUserList()

  socket.auto('User created', updateUserList, $scope)
  socket.auto('User deleted', updateUserList, $scope)
  socket.auto('User updated', updateUserList, $scope)

  function updateUserList () {
    User.query({select: 'name username avatarImage'}).$promise.then(result => { vm.users = result })
  }
}
