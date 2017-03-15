'use strict'

var mongoose = require('mongoose')
var Q = require('q')
var _ = require('lodash')

mongoose.Promise = Q.Promise

module.exports = function () {
  function skipFind (find, req) {
    if (req.query.skip) return find.skip(parseInt(req.query.skip))
    if (req.query.page && req.query.limit) return find.skip(parseInt(req.query.page) * parseInt(req.query.limit))
    return find
  }

  function limitFind (find, req) {
    return req.query.limit ? find.limit(parseInt(req.query.limit)) : find
  }

  function populateFind (find, req) {
    return req.query.populate ? find.populate(decodeURIComponent(req.query.populate)) : find
  }

  function doList (find, req) {
    return populateFind(limitFind(skipFind(find, req), req), req).lean().exec()
  }

  function createRestRoute (controller, apiBase) {
    return function (myPackage, app, auth, db, io) {
      if (controller.setIo) controller.setIo(io)

      app.route(apiBase)
      .get(controller.list)

      app.route(apiBase+'/count')
      .get(controller.count)

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
  function countAction (Model, req, res) {
    var findQuery = _.pickBy(req.query, function (value, key) {
      return key !== 'populate' && key !== 'skip' && key !== 'limit' && key !== 'page'
    })

    Model.count(findQuery)
    .exec()
    .then((c) => {
      res.send({count: c})
    })
    .catch((err) => {
      res.status(500).send(err)
    })
  }

  function listAction (Model, req, res) {
    var findQuery = _.pickBy(req.query, function (value, key) {
      return key !== 'populate' && key !== 'skip' && key !== 'limit' && key !== 'page'
    })

    doList(Model.find(findQuery), req)
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      res.status(500).send(err)
    })
  }

  function createRestController (modelName) {
    var Model = mongoose.model(modelName)

    var io = null

    return {
      Model: Model,
      setIo: function (_io) {
        io = _io
      },
      list: function (req, res) {
        listAction(Model, req, res)
      },
      count: function (req, res) {
        countAction(Model, req, res)
      },
      create: function (req, res) {
        var instance = new Model(req.body)

        instance.save()
        .then(function () {
          res.send(instance)
          io.emit(modelName + ' created', instance)
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
        Model.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
        .then(function (instance) {
          res.send({})
          io.emit(modelName + ' updated', instance)
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      },
      delete: function (req, res) {
        Model.findById({_id: req.params.id}).exec()
        .then(function (instance) {
          instance.remove(function (err, result) {
            if (err) throw err

            res.send({})
            io.emit(modelName + ' deleted', req.params.id)
          })
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      }
    }
  }

  return {
    list: doList,
    listAction: listAction,
    countAction: countAction,
    skipFind: skipFind,
    limitFind: limitFind,
    populateFind: populateFind,
    createRestRoute: createRestRoute,
    createRestController: createRestController
  }
}
