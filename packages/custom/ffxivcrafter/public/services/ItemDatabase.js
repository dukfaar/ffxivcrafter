'use strict'

angular.module('mean.ffxivCrafter').factory('ItemDatabase', ['Item', function (Item) {
  var items = {}

  return {
    get: function(itemId) {
      if(!items[itemId]) items[itemId] = Item.get({id: itemId})
      return items[itemId]
    }
  }
}])
