'use strict'

angular.module('mean.ffxivCrafter').factory('ItemDatabase', ['Item', 'socket', function (Item, socket) {
  var items = {}

  socket.on('price data changed', function (data) {
    items[data.item._id] = data.item
  })

  socket.on('item data changed', function (data) {
    items[data.item._id] = data.item
  })

  return {
    get: function(itemId) {
      if(!items[itemId]) items[itemId] = Item.get({id: itemId})
      return items[itemId]
    }
  }
}])
