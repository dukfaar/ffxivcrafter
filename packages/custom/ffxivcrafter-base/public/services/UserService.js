'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserService', UserService)

UserService.$inject = ['MeanUser', 'User', '$timeout']

function UserService (MeanUser, User, $timeout) {
  var service = {
    user: MeanUser.user,
    allowed: allowed,
    updateUser: updateUser,
    regrabUser: regrabUser
  }

  return service

  function allowed (permission) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
  }

  function updateUser () {
    User.update({ id: MeanUser.user._id }, MeanUser.user)
  }

  function regrabUser () {
    service.user = MeanUser.user
  }
}
