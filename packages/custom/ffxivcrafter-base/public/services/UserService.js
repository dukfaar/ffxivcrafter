'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserService', UserService)

UserService.$inject = ['MeanUser', 'User']

function UserService (MeanUser, User) {
  var service = {
    user: MeanUser.user,
    allowed: allowed,
    updateUser: updateUser
  }

  return service

  function allowed (permission) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
  }

  function updateUser () {
    User.update({ id: MeanUser.user._id }, MeanUser.user)
  }
}
