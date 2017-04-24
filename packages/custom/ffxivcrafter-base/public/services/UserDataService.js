'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('UserDataService', UserDataService)

UserDataService.$inject = ['MeanUser']

function UserDataService (MeanUser) {
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
          newR.user = id
          return newR.$save().then(() => { return fetchOrCreateUserData(Resource) })
        }
      })
  }

  function fetchOrCreateUserData (Resource) {
    return fetchOrCreateUserDataForUserId(Resource, MeanUser.user._id)
  }
}
