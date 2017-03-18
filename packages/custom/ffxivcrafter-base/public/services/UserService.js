'use strict'

angular.module('mean.ffxivCrafter_base').factory('UserService', [
  'MeanUser',
  function (MeanUser) {
    return {
      user: MeanUser.user,
      allowed: function (permission) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(permission) !== -1
      }
    }
  }])
