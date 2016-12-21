'use strict'

var mongoose = require('mongoose')
var Q = require('q')
mongoose.Promise = Q.Promise

var RestService = require('../services/RestService')()

module.exports = function () {
  return {
    schema: function(req, res) {
      res.send(mongoose.model(req.params.modelName).schema.paths)
    },
    list: function (req, res) {
      var Model = mongoose.model(req.params.modelName)

      RestService.list(Model.find({}), req)
      .then(function(result) {
        res.send(result)
      })
      .catch(function(error) {
        res.status(500).send(error)
      })
    },
    create: function (req, res) {
      var Model = mongoose.model(req.params.modelName)

      var instance = new Model()

      instance.save()
      .then(function () {
        res.json({})
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    get: function (req, res) {
      var Model = mongoose.model(req.params.modelName)

      RestService.populateFind(Model.findById(req.params.id), req).exec()
      .then(function (instance) {
        res.send(instance)
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    update: function (req, res) {
      var Model = mongoose.model(req.params.modelName)

      Model.findByIdAndUpdate(req.params.id, req.body).exec()
      .then(function (part) {
        res.send({})
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    delete: function (req, res) {
      var Model = mongoose.model(req.params.modelName)

      Model.findByIdAndRemove(req.params.id).exec()
      .then(function () {
        res.send({})
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    }
  }
}
