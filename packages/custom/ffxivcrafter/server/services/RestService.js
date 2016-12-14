'use strict'

var mongoose = require('mongoose')
var Q = require('q')
//var _ = require('lodash')

mongoose.Promise = Q.Promise

module.exports = function () {

  function skipFind(find, req) {
    if(req.query.skip) return find.skip(parseInt(req.query.skip))
    if(req.query.page && req.query.limit) return find.skip(parseInt(req.query.page) * parseInt(req.query.limit))
    return find
  }

  function limitFind(find, req) {
    return req.query.limit ? find.limit(parseInt(req.query.limit)) : find
  }

  function populateFind(find, req) {
    return req.query.populate ? find.populate(req.query.populate) : find
  }

  function list (find, req) {
    return populateFind(limitFind(skipFind(find, req), req), req).lean().exec()
  }

  function createRestRoute (controller, apiBase) {
    return function (myPackage, app, auth, db) {
      app.route(apiBase)
      .get(controller.list)

      app.route(apiBase)
      .post(controller.create)

      app.route(apiBase + '/:id')
      .get(controller.get)

      app.route(apiBase + '/:id')
      .delete(controller.delete)

      app.route(apiBase + '/:id')
      .put(controller.update)
    }
  }

  function createRestController (modelName) {
    var Model = mongoose.model(modelName)

    return {
      list: function (req, res) {
        list(Model.find({}), req)
        .then(function (result) {
          res.send(result)
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      },
      create: function (req, res) {
        var instance = new Model()

        instance.save()
        .then(function () {
          res.json({text: 'instance created'})
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      },
      get: function (req, res) {
        populateFind(Model.findById(req.params.id), req).exec()
        .then(function (instance) {
          res.send(instance)
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      },
      update: function (req, res) {
        Model.findByIdAndUpdate(req.params.id, req.body).exec()
        .then(function (part) {
          res.send({})
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      },
      delete: function (req, res) {
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

  return {
    list: list,
    skipFind: skipFind,
    limitFind: limitFind,
    populateFind: populateFind,
    createRestRoute: createRestRoute,
    createRestController: createRestController
  }
}
