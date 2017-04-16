'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserService', UserService)

UserService.$inject = ['$rootScope', 'MeanUser', 'User', '$timeout', 'UserDatabase']

function UserService ($rootScope, MeanUser, User, $timeout, UserDatabase) {
  var service = {
    user: UserDatabase.get(MeanUser.user._id),
    allowed: allowed,
    updateUser: updateUser,
    regrabUser: regrabUser
  }

  $rootScope.$on('logout', regrabUser)
  $rootScope.$on('loggedin', regrabUser)

  return service

  function allowed (permission) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
  }

  function updateUser () {
    User.update({ id: MeanUser.user._id }, service.user)
  }

  function regrabUser () {
    console.log(MeanUser.user)
    UserDatabase.get(MeanUser.user._id).$promise.then((result) => {
      service.user = result
      $rootScope.$broadcast('userservice refetched user')
    })
  }
}
