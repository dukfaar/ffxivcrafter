'use strict'

var httpreq = require('httpreq')
var mongoose = require('mongoose')

var Item = mongoose.model('Item')

module.exports = function () {
  function setItemData (item, itemData) {
    console.log('setting item data ' + itemData.name)
    item.name = itemData.name

    if (itemData.gathering && itemData.gathering.length > 0) {
      item.gatheringLevel = itemData.gathering[0].level_view
      if (itemData.gathering[0].type_name === 'Mining' || itemData.gathering[0].type_name === 'Quarrying') {
        item.gatheringJob = 'Miner'
        if (item.gatheringEffort === 0) item.gatheringEffort = 1
      }
      else if (itemData.gathering[0].type_name === 'Logging' || itemData.gathering[0].type_name === 'Harvesting') {
        item.gatheringJob = 'Botanist'
        if (item.gatheringEffort === 0) item.gatheringEffort = 1
      }
    }
    console.log(item)
  }

  function getDataFromXivdb (id, callback) {
    httpreq.get('http://api.xivdb.com/item/' + id, function (err, xivItemData) {
      if (err) throw err

      callback(xivItemData)
    })
  }

  function tryParse (data) {
    try {
      return JSON.parse(data)
    } catch(e) {
      console.log(data)
      throw e
    }
  }

  return {
    importItem: function (xivid, callback) {
      getDataFromXivdb(xivid, function (xivItemData) {
        var item = new Item()

        setItemData(item, tryParse(xivItemData.body))

        item.save(function (err) {
          if (err) throw err

          callback(item)
        })
      })
    },
    findOrCreateItem: function (name, xivid, callback, overWrite) {
      Item.findOne({name: name})
        .exec(function (err, item) {
          if (err) throw err

          var loadDataFromXiv = item == null || overWrite

          if (item == null) {
            item = new Item()
          }

          if (loadDataFromXiv) {
            getDataFromXivdb(xivid, function (xivItemData) {
              setItemData(item, tryParse(xivItemData.body))

              item.save(function (err) {
                if (err) throw err

                callback(item,true)
              })
            })
          } else {
            callback(item,false)
          }
        })
    }
  }
}
