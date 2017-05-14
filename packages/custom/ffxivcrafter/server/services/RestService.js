'use strict'

var mongoose = require('mongoose')
var Q = require('q')
var _ = require('lodash')

const log4js = require('log4js')

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

  function selectFind (find, req) {
    return req.query.select ? find.select(req.query.select) : find
  }

  function sortFind (find, req) {
    return req.query.sort ? find.sort(req.query.sort) : find
  }

  function doList (find, req) {
    return sortFind(populateFind(selectFind(limitFind(skipFind(find, req), req), req), req), req).lean().exec()
  }

  function createRestRoute (controller, apiBase) {
    return function (myPackage, app, auth, db, io) {
      if (controller.setIo) controller.setIo(io)

      app.route(apiBase)
      .get(controller.list)

      app.route(apiBase + '/count')
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

  function countOperation (Model, query) {
    var findQuery = _.pickBy(query, function (value, key) {
      return key !== 'populate' && key !== 'skip' && key !== 'limit' && key !== 'page' && key !== 'select' && key !== 'sort'
    })

    return Model.count(findQuery).exec()
  }

  function countAction (Model, req, res, logger) {
    countOperation(Model, req.query)
    .then((c) => {
      res.send({count: c})
    })
    .catch((err) => {
      if (logger) logger.error('Error counting %s: %s', Model.modelName, err)
      res.status(500).send(err)
    })
  }

  function getFindQuery (query) {
    return _.pickBy(query, function (value, key) {
      return key !== 'populate' && key !== 'skip' && key !== 'limit' && key !== 'page' && key !== 'select' && key !== 'sort'
    })
  }

  function listOperation (Model, req) {
    var findQuery = getFindQuery(req.query)

    return doList(Model.find(findQuery), req)
  }

  function listAction (Model, req, res, logger) {
    listOperation(Model, req)
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      if (logger) logger.error('Error listing %s: %s', Model.modelName, err)
      res.status(500).send(err)
    })
  }

  function createRestController (modelName) {
    const logger = log4js.getLogger('app.restservice.controller.' + modelName)

    var Model = mongoose.model(modelName)

    var io = null

    function doCreate (req, res) {
      var instance = new Model(req.body)

      return instance.save()
      .then(function () {
        res.send(instance)
        io.emit(modelName + ' created', instance)
      })
      .catch(function (err) {
        logger.error('Error creating %s: %s', modelName, err)
        res.status(500).send(err)
      })
    }

    function doUpdate (req, res) {
      return Model.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
      .then(function (instance) {
        res.send({})
        io.emit(modelName + ' updated', instance)
      })
      .catch(function (err) {
        logger.error('Error updating %s with id=%s: %s', modelName, req.params.id, err)
        logger.error('body: %s', req.body)
        res.status(500).send(err)
      })
    }

    function doDelete (req, res) {
      return Model.findById({_id: req.params.id}).exec()
      .then(function (instance) {
        instance.remove(function (err, result) {
          if (err) throw err

          res.send({})
          io.emit(modelName + ' deleted', req.params.id)
        })
      })
      .catch(function (err) {
        logger.error('Error deleting %s with id=%s: %s', modelName, req.params.id, err)
        res.status(500).send(err)
      })
    }

    return {
      Model: Model,
      logger: logger,
      setIo: function (_io) {
        io = _io
      },
      list: function (req, res) {
        listAction(Model, req, res, logger)
      },
      count: function (req, res) {
        countAction(Model, req, res, logger)
      },
      doCreate: doCreate,
      create: function (req, res) {
        doCreate(req, res)
      },
      get: function (req, res) {
        selectFind(populateFind(Model.findById(req.params.id), req), req).exec()
        .then(function (instance) {
          res.send(instance)
        })
        .catch(function (err) {
          logger.error('Error getting %s with id=%s: %s', modelName, req.params.id, err)
          res.status(500).send(err)
        })
      },
      doUpdate: doUpdate,
      update: function (req, res) {
        doUpdate(req, res)
      },
      doDelete: doDelete,
      delete: function (req, res) {
        doDelete(req, res)
      }
    }
  }

  return {
    list: doList,
    listAction: listAction,
    listOperation: listOperation,
    countAction: countAction,
    countOperation: countOperation,
    skipFind: skipFind,
    limitFind: limitFind,
    populateFind: populateFind,
    createRestRoute: createRestRoute,
    createRestController: createRestController
  }
}
