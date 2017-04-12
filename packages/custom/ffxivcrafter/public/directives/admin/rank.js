'use strict'

angular.module('mean.ffxivCrafter')
.directive('adminRanks', AdminRanksDirective)

function AdminRanksDirective () {
  return {
    controller: AdminRanksController,
    controllerAs: 'adminRankController',
    templateUrl: '/ffxivCrafter/views/admin/ranks.html'
  }
}

AdminRanksController.$inject = ['$scope', 'socket', 'User', 'Rank', 'UserRank', 'UserDataService', '_', 'RankDatabase']

function AdminRanksController ($scope, socket, User, Rank, UserRank, UserDataService, _, RankDatabase) {
  var vm = this
  this.RankDatabase = RankDatabase
  this.ranks = []
  this.users = []
  this.userRanks = {}
  this.createRank = createRank
  this.updateRank = updateRank
  this.deleteRank = deleteRank
  this.updateUserRank = updateUserRank

  fetchRanks()
  fetchUsers()
  fetchUserRanks()

  socket.auto('Rank created', fetchRanks, $scope)
  socket.auto('Rank updated', fetchRanks, $scope)
  socket.auto('Rank deleted', fetchRanks, $scope)

  socket.auto('UserRank created', fetchUserRanks, $scope)
  socket.auto('UserRank updated', fetchUserRanks, $scope)
  socket.auto('UserRank deleted', fetchUserRanks, $scope)

  function fetchUserRanks () {
    UserRank.query({}).$promise.then(userRanks => {
      vm.userRanks = _.keyBy(userRanks, 'user')
    })
  }

  function fetchRanks () {
    Rank.query({}).$promise.then(ranks => {
      vm.ranks = ranks
    })
  }

  function fetchUsers () {
    User.query({select: 'name'}).$promise.then(users => {
      vm.users = users
    })
  }

  function createRank () {
    let newRank = new Rank()
    newRank.name = 'Name Me!'
    newRank.$save()
  }

  function deleteRank (rank) {
    Rank.delete({id: rank._id})
  }

  function updateRank (rank) {
    Rank.update({id: rank._id}, rank)
  }

  function updateUserRank (user, userRank) {
    if (userRank._id) {
      UserRank.update({id: userRank._id}, userRank)
    } else {
      let newUserRank = new UserRank()
      newUserRank.user = user._id
      newUserRank.rank = userRank.rank
      newUserRank.$save()
    }
  }
}
