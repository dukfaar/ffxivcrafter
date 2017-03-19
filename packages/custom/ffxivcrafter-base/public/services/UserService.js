'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserService', UserService)

UserService.$inject = ['MeanUser']

function UserService (MeanUser) {
  var service = {
    user: MeanUser.user,
    allowed: allowed
  }

  return service

  function allowed (permission) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
  }
}
