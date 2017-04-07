'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserDataService', UserDataService)

UserDataService.$inject = ['UserService']

function UserDataService (UserService) {
  var service = {
    fetchOrCreateUserDataForUserId: fetchOrCreateUserDataForUserId,
    fetchOrCreateUserData: fetchOrCreateUserData
  }

  return service

  function fetchOrCreateUserDataForUserId (Resource, id) {
    return Resource.query({user: id})
      .$promise.then(function (result) {
        if (result.length > 0) {
          return result[0]
        } else {
          let newR = new Resource()
          newR.user = UserService.user._id
          return newR.$save().then(() => { return fetchOrCreateUserData(Resource) })
        }
      })
  }

  function fetchOrCreateUserData (Resource) {
    return fetchOrCreateUserDataForUserId(Resource, UserService.user._id)
  }
}
