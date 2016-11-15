'use strict'

var mongoose = require('mongoose')
var ProjectStockChange = mongoose.model('ProjectStockChange')
var Recipe = mongoose.model('Recipe')

var Q = require('q')
var _ = require('lodash')

mongoose.Promise = Q.Promise

module.exports = function () {

  var RestService = require('../services/RestService')()

  return {
    list: function (req, res) {
      var q = {
      }

      if(req.query.projectId) {
        q.project = req.query.projectId
      }

      RestService.list(ProjectStockChange.find(q), req)
      .then(function (result) {
          res.send(result)
      })
    },
    create: function (req, res) {
      var change = new ProjectStockChange()

      change.save(function (err) {
        if (err) res.status(500).send(err)

        res.json({text: 'StockChange created'})
      })
    },
    get: function (req, res) {
      ProjectStockChange.findById(req.params.id).populate('submitter item project').exec(function (err, change) {
        if (err) res.status(500).send(err)

        res.send(change)
      })
    },
    update: function (req, res) {
      ProjectStockChange.findByIdAndUpdate(req.params.id, req.body, function (err, change) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    },
    delete: function (req, res) {
      ProjectStockChange.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    }
  }
}
