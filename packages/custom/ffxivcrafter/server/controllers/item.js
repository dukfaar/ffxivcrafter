'use strict'

var mongoose = require('mongoose')
var Item = mongoose.model('Item')

var httpreq = require('httpreq')

module.exports = function () {
  var itemImport = require('../services/itemImport')()

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

      q.exec(function (err, data) {
        if (err) throw err

        var result = {
          count: count,
          list: data
        }

        res.send(result)
      })
    })
  }

  return {
    list: function (req, res) {
      doFind({}, req, res)
    },
    filteredList: function (req, res) {
      doFind({'name': {$regex: req.params.q,$options: 'i'}}, req, res)
    },
    oldest: function (req, res) {
      Item.find()
        .sort('lastPriceUpdate')
        .limit(10)
        .exec(function (err, result) {
          res.send(result)
        })
    },
    create: function (req, res) {
      var item = new Item()
      item.name = 'No Name'

      item.save(function (err) {
        if (err) res.send(err)

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
      Item.findById(req.params.id, function (err, item) {
        if (err) throw err

        item.price = req.params.price
        item.priceHQ = req.params.priceHQ
        item.lastPriceUpdate = Date.now()

        item.save(function (err) {
          if (err) res.status(500).send('Could not save new price: ' + err)
          else res.send(item)
        })
      })
    },
    update: function (req, res) {
      Item.findByIdAndUpdate(req.params.id, req.body, function (err, item) {
        if (err) throw err

        res.send(item)
      })
    },
    delete: function (req, res) {
      Item.findByIdAndRemove(req.params.id, function (err) {
        if (err) throw err

        res.send({})
      })
    },
    xivdbImport: function (req, res) {
      itemImport.importItem(req.params.id, function (item) {
        res.status(200).send('Imported ' + item.name + ' imported')
      })
    },
    fullXivdbImport: function (req, res) {
      var url = 'http://api.xivdb.com/item'

      httpreq.get(url, function (err, xivdata) {
        if (err) {
          res.status(500).send('Request failed')
        } else {
          var data

          try {
            data = JSON.parse(xivdata.body)
          } catch (err) {
            res.status(500).send('Failed to parse the xiv data')
            return
          }

          var timeoutCounter = 0

          data.forEach(function (itemData) {
            setTimeout(function () {
              itemImport.findOrCreateItem(itemData.name, itemData.id, function (item) {}, true)
            }, timeoutCounter)

            timeoutCounter += 100
          })

          res.status(200).send('working on it, this will take a while')
        }
      })
    },
    fullXivdbImportNoOverwrite: function (req, res) {
      var url = 'http://api.xivdb.com/item'

      httpreq.get(url, function (err, xivdata) {
        if (err) {
          res.status(500).send('Request failed')
        } else {
          var data

          try {
            data = JSON.parse(xivdata.body)
          } catch (err) {
            res.status(500).send('Failed to parse the xiv data')
            return
          }

          function checkNextItem (index) {
            if (index >= data.length) return

            var itemData = data[index]

            itemImport.findOrCreateItem(itemData.name, itemData.id, function (item, newItem) {
              if (newItem) {
                setTimeout(function () {
                  checkNextItem(index + 1)
                }, 100)
              } else {
                checkNextItem(index + 1)
              }
            }, false)
          }

          checkNextItem(0)

          res.status(200).send('working on it, this will take a while')
        }
      })
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
