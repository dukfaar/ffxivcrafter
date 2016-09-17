'use strict'

angular.module('mean.ffxivCrafter').factory('itemService', [ '$http',
  function ($http) {
    var instance

    instance.itemList = {}
    instance.itemCount = 0
    instance.maxPage = 0
    instance.filter = {}

    instance.limit = 10
    instance.page = 0

    instance.updateList = function (p) {
      var url = '/api/item'
      if (instance.filter !== '')
        url = '/api/item/filteredList/' + $scope.filter

      var params = {
        limit: instance.limit,
        page: instance.page
      }

      $http.get(url, {params: params})
        .then(function (response) {
          instance.itemList = response.data.list
          instance.itemCount = response.data.count
          instance.maxPage = Math.floor(instance.itemCount / instance.limit)
        })
    }

    return instance
  }
])
