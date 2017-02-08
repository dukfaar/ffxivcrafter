'use strict'

var httpreq = require('httpreq')
var mongoose = require('mongoose')

var Item = mongoose.model('Item')

var Q = require('q')
mongoose.Promise = Q.Promise

module.exports = function () {
  var xivdbService = require('../services/xivdbService')()

  function setItemData (item, itemData) {
    item.name = itemData.name

    if (itemData.gathering && itemData.gathering.length > 0) {
      item.gatheringLevel = itemData.gathering[0].level_view
      if (itemData.gathering[0].type_name === 'Mining' || itemData.gathering[0].type_name === 'Quarrying') {
        item.gatheringJob = 'Miner'
        if (item.gatheringEffort === 0) item.gatheringEffort = 1
      } else if (itemData.gathering[0].type_name === 'Logging' || itemData.gathering[0].type_name === 'Harvesting') {
        item.gatheringJob = 'Botanist'
        if (item.gatheringEffort === 0) item.gatheringEffort = 1
      }
    }
  }

  return {
    importItem: function (xivid, callback) {
      xivdbService.getData('http://api.xivdb.com/item/' + xivid)
      .then(function (data) {
        setItemData(item, data)

        item.save(function (err) {
          if (err) throw err

          callback(item)
        })
      })
    },
    findOrCreateItem: function (name, xivid, overWrite) {
      return Item.findOne({name: name})
        .exec()
        .then(function (item) {
          var loadDataFromXiv = item == null || overWrite

          if (item == null) {
            item = new Item()
          }

          if (loadDataFromXiv) {
            return xivdbService.getData('http://api.xivdb.com/item/' + xivid)
            .then(function (data) {
              setItemData(item, data)

              return item.save()
              .then((item) => {
                return item
              })
              .then(() => {
                return item
              })
              .catch((err) => {
                console.log(err)
                throw err
              })
            })
          }
          return item
        })
        .catch((err) => {
          throw err
        })
    }
  }
}
