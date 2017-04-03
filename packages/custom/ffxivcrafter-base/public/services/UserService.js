'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserService', UserService)

UserService.$inject = ['MeanUser', 'User', '$timeout', 'UserDatabase']

function UserService (MeanUser, User, $timeout, UserDatabase) {
  var service = {
    user: UserDatabase.get(MeanUser.user._id),
    allowed: allowed,
    updateUser: updateUser,
    regrabUser: regrabUser
  }

  return service

  function allowed (permission) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
  }

  function updateUser () {
    User.update({ id: MeanUser.user._id }, service.user)
  }

  function regrabUser () {
    service.user = UserDatabase.get(MeanUser.user._id)
  }
}
