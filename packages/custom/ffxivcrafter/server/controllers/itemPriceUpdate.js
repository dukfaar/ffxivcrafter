'use strict'

var mongoose = require('mongoose')
var ItemPriceUpdate = mongoose.model('ItemPriceUpdate')

module.exports = function () {
  return {
    list: function (req, res) {
      console.log(req.query)
      ItemPriceUpdate.find(req.query)
      .exec()
      .then(function (result) {
        res.send(result)
      }).catch(function (err) {
          res.status(500).send(err)
      })
    },
    create: function (req, res) {
      var part = new ItemPriceUpdate()

      part.save()
      .then(function (part) {
        res.json({text: 'Part created'})
      }).catch(function (err) {
        if (err) res.status(500).send(err)
      })
    },
    get: function (req, res) {
      ItemPriceUpdate.findById(req.params.id).exec()
      .then(function (part) {
        res.send(part)
      }).catch(function (err) {
        res.status(500).send(err)
      })
    },
    update: function (req, res) {
      ItemPriceUpdate.findByIdAndUpdate(req.params.id, req.body).exec()
        .then(function (part) {
          res.send({})
        }).catch(function (err) {
          res.status(500).send(err)
        })
    },
    delete: function (req, res) {
      ItemPriceUpdate.findByIdAndRemove(req.params.id).exec()
        .then(function (part) {
          res.send({})
        }).catch(function (err) {
          res.status(500).send(err)
        })
    }
  }
}
