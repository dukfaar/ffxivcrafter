'use strict'

angular.module('mean.ffxivCrafter_base').factory('UserDatabase', ['User', function (User) {
  var users = {}

  return {
    get: function (id) {
      if(!users[id]) users[id] = User.get({id: id})
      return users[id]
    }
  }
}])
