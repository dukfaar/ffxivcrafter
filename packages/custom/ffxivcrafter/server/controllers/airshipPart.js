'use strict'

var mongoose = require('mongoose')
var AirshipPart = mongoose.model('AirshipPart')

var Q = require('q')
mongoose.Promise = Q.Promise
var _ = require('lodash')

module.exports = function () {
  return {
    list: function (req, res) {
      AirshipPart.find({})
      .exec(function (err, result) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(result)
        }
      })
    },
    create: function (req, res) {
      var part = new AirshipPart()

      part.save(function (err) {
        if (err) res.status(500).send(err)

        res.json({text: 'Part created'})
      })
    },
    get: function (req, res) {
      AirshipPart.findById(req.params.id, function (err, part) {
        if (err) res.status(500).send(err)

        res.send(part)
      })
    },
    update: function (req, res) {
      AirshipPart.findByIdAndUpdate(req.params.id, req.body, function (err, part) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    },
    delete: function (req, res) {
      AirshipPart.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    }
  }
}
