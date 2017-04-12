'use strict'

angular.module('mean.ffxivCrafter').controller('MemberList', MemberListController)

MemberListController.$inject = ['$scope', 'User', 'socket', 'UserRank', 'RankDatabase', 'UserDataService']

function MemberListController ($scope, User, socket, UserRank, RankDatabase, UserDataService) {
  let vm = this
  this.users = []
  this.userRanks = {}

  updateUserList()
  fetchUserRanks()

  socket.auto('User created', updateUserList, $scope)
  socket.auto('User deleted', updateUserList, $scope)
  socket.auto('User updated', updateUserList, $scope)

  socket.auto('UserRank created', fetchUserRanks, $scope)
  socket.auto('UserRank deleted', fetchUserRanks, $scope)
  socket.auto('UserRank updated', fetchUserRanks, $scope)

  function fetchUserRanks () {
    UserRank.query({}).$promise.then((userRanks) => {
      _.forEach(userRanks, (userRank) => {
        vm.userRanks[userRank.user] = RankDatabase.get(userRank.rank)
      })
    })
  }

  function updateUserList () {
    User.query({select: 'name username avatarImage'}).$promise.then(result => {
      vm.users = result
    })
  }
}
