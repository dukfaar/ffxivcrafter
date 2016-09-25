'use strict'

angular.module('mean.ffxivCrafter').factory('ItemService', [ '$http',
  function ($http) {
    var instance = {}

    instance.itemList = {}
    instance.itemCount = 0
    instance.maxPage = 0
    instance.filter = ''

    instance.limit = 10
    instance.page = 0

    instance.pageArray = function () {
      var result = []
      for (var i = Math.max(0, instance.page - 3);i <= Math.min(instance.page + 3, instance.maxPage);i++) result.push(i)

      return result
    }

    instance.prevPage = function () {
      if (instance.page > 0) {
        instance.page--
        instance.updateList()
      }
    }

    instance.nextPage = function () {
      if (instance.page < instance.maxPage) {
        instance.page++
        instance.updateList()
      }
    }

    instance.toPage = function (pageNum) {
      if (instance.page != pageNum) {
        instance.page = pageNum
        instance.updateList()
      }
    }

    instance.updateList = function (p) {
      var url = '/api/item'

      var filter = (p && p.filter) ? p.filter : instance.filter
      if (filter !== '')
        url = '/api/item/filteredList/' + filter

      var params = {
        limit: (p && p.limit) ? p.limit : instance.limit,
        page: (p && p.page) ? p.page : instance.page
      }

      if (p) {
        if (p.privileged && p.privileged === true) params.privileged = true
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
