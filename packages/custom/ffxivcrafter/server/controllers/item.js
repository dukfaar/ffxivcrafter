'use strict'

var mongoose = require('mongoose')
var Item = mongoose.model('Item')
var ItemPriceUpdate = mongoose.model('ItemPriceUpdate')
var ProjectStep = mongoose.model('ProjectStep')
var Q = require('q')
mongoose.Promise = Q.Promise

var httpreq = require('httpreq')

var _ = require('lodash')

module.exports = function (io) {
  var itemImport = require('../services/itemImport')()
  var itemService = require('../services/itemService')()
  var xivdbService = require('../services/xivdbService')()

  var oldestItems = null

  var doFind = function (query, req, res) {
    if (req.query.privileged && req.query.privileged === 'true') {
      query['canBeOrderedByUnprivileged'] = true
    }

    if (req.query.mbItems && req.query.mbItems === 'true') {
      query['soldOnMarket'] = true
    }

    var limit = parseInt(req.query.limit)
    var page = parseInt(req.query.page)

    Item.count(query, function (err, count) {
      var q = Item.find(query)

      if (limit && limit > 0) q = q.limit(limit)
      if (page && page > -1) q = q.skip(page * limit)

      q.lean().exec(function (err, data) {
        if (err) throw err

        var result = {
          count: count,
          list: data
        }

        res.send(result)
      })
    })
  }

  var oldestItemsTimeout = null

  function clearOldestItemsTimeout() {
    if(oldestItemsTimeout) {
      clearTimeout(oldestItemsTimeout)
      oldestItemsTimeout = null
    }
  }

  function clearOldestItems() {
    oldestItems = null
    clearOldestItemsTimeout()
  }

  function queryOldestItems() {
    var now = new Date()
    return Item.aggregate()
    .match({
      $or: [
        {'datedObject': false},
        {'datedObject': {$exists: false}}
      ]
    })
    .project({
      name: true,
      price: true,
      priceHQ: true,
      weightedAge: {$multiply: [{$subtract: [now, '$lastPriceUpdate']}, '$ageMultiplier']}
    })
    .sort('-weightedAge')
    .limit(10)
    .exec()
    .then(function(result) {
      oldestItems = result
      clearOldestItemsTimeout()
      oldestItemsTimeout = setTimeout(clearOldestItems, 1000*60*10)
      return oldestItems
    })
    .catch(function(err) {
      throw err
    })
  }

  return {
    list: function (req, res) {
      doFind({}, req, res)
    },
    filteredList: function (req, res) {
      doFind({'name': {$regex: req.params.q, $options: 'i'}}, req, res)
    },
    updateAllAgeMultipliers: function (req, res) {
      itemService.updateAllAgeMultipliers()
      .then(function (result) {
        res.send('done')
      })
    },
    oldest: function (req, res) {
      if(oldestItems === null) {
        queryOldestItems()
        .then(function(result) {
          res.send(oldestItems)
        })
      }
      else res.send(oldestItems)
    },
    create: function (req, res) {
      var item = new Item()
      item.name = 'No Name'

      item.save(function (err) {
        if (err) res.send(err)

        clearOldestItems()

        res.json({text: 'Item created'})
      })
    },
    get: function (req, res) {
      Item.findById(req.params.id, function (err, item) {
        if (err) throw err

        res.send(item)
      })
    },
    updatePrice: function (req, res) {
      Item.findById(req.params.id).exec().then(function (item) {
        item.price = req.params.price
        item.priceHQ = req.params.priceHQ
        item.lastPriceUpdate = Date.now()

        var change = new ItemPriceUpdate()
        change.item = item
        change.price = req.params.price
        change.priceHQ = req.params.priceHQ
        change.date = item.lastPriceUpdate
        change.updatedBy = req.user._id
        change.save().then(function (change) { io.emit('new price change entry', {item: item}) })

        clearOldestItems()

        return item.save()
      }).then(function (item) {
        io.emit('price data changed', {item: item})
        res.send({})
      }).catch(function (err) {
        if (err) res.status(500).send('Could not save new price: ' + err)
      })
    },
    update: function (req, res) {
      Item.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
        if (err) throw err

        clearOldestItems()

        io.emit('item data changed', {item: item})
        res.send(item)
      })
    },
    delete: function (req, res) {
      Item.findByIdAndRemove(req.params.id, function (err) {
        if (err) throw err

        clearOldestItems()

        res.send({})
      })
    },
    xivdbImport: function (req, res) {
      itemImport.importItem(req.params.id, function (item) {
        res.status(200).send('Imported ' + item.name + ' imported')
        clearOldestItems()
      })
    },
    fullXivdbImport: function (req, res) {
      xivdbService.getData('http://api.xivdb.com/item')
      .then(function (data) {

        var itemsDone = 0

        function emitProgress () {
          io.emit('xivdb item import progress', {
            itemsDone: itemsDone,
            totalItems: data.length
          })
        }

        function checkEmitProgress () {
          if (itemsDone % 10 === 0) {
            emitProgress()
          }
        }

        _.reduce(data, (promise, itemData) => {
          return promise
          .then(() => {
            return itemImport.findOrCreateItem(itemData.name, itemData.id, true)
          })
          .then((item) => {
            itemsDone++

            checkEmitProgress()
          })
        }, Q.delay(0))
        .then(() => {
          emitProgress()
          clearOldestItems()
          io.emit('xivdb item import done', {})
        })
      })

      res.status(200).send('working on it, this will take a while')
    },
    fullXivdbImportNoOverwrite: function (req, res) {
      xivdbService.getData('http://api.xivdb.com/item')
      .then(function (data) {

        var itemsDone = 0

        function emitProgress () {
          io.emit('xivdb item import noow progress', {
            itemsDone: itemsDone,
            totalItems: data.length
          })
        }

        function checkEmitProgress () {
          if (itemsDone % 10 === 0) {
            emitProgress()
          }
        }

        _.reduce(data, (promise, itemData) => {
          return promise
          .then(() => {
            return itemImport.findOrCreateItem(itemData.name, itemData.id, false)
          })
          .then((item) => {
            itemsDone++

            checkEmitProgress()
          })
        }, Q.delay(0))
        .then(() => {
          clearOldestItems()
          emitProgress()
          io.emit('xivdb item import noow done', {})
        })
      })
      res.status(200).send('working on it, this will take a while')
    },
    importList: function (req, res) {
      var importData = req.body.importText.split(/\r|\n/)
      var filteredData = importData.filter(function (elem, pos) {
        return importData.indexOf(elem) == pos
      })

      var newCounter = 0
      var savedCounter = 0

      filteredData.forEach(function (name) {
        Item.findOne({name: name}, function (err, item) {
          if (err) throw err

          if (!item) {
            console.log('trying to create ' + name)
            newCounter++

            item = new Item()
            item.name = name
            item.save(function (err) {
              if (err) throw err

              savedCounter++
            })
          }
        })
      })

      res.send({
        newItems: newCounter,
        savedItems: savedCounter
      })
    }
  }
}
