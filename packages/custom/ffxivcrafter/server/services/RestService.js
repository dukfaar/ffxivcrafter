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

  function countAction (Model, req, res) {
    const logger = log4js.getLogger('app.restservice.' + Model.modelName)

    countOperation(Model, req.query)
    .then((c) => {
      res.send({count: c})
    })
    .catch((err) => {
      logger.error('Error counting %s: %s', Model.modelName, err)
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

  function listAction (Model, req, res) {
    const logger = log4js.getLogger('app.restservice.' + Model.modelName)

    listOperation(Model, req)
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      logger.error('Error listing %s: %s', Model.modelName, err)
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
        logger.info('New %s created', Model.modelName, req.body)
        logger.info('body: %s', req.body)
        res.send(instance)
        io.emit(Model.modelName + ' created', instance)
      })
      .catch(function (err) {
        logger.error('Error creating %s: %s', Model.modelName, err)
        res.status(500).send(err)
      })
    }

    function doUpdate (req, res) {
      return Model.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec()
      .then(function (instance) {
        logger.info('%s with id=%s updated', Model.modelName, req.params.id)
        logger.info('body: ', req.body)
        res.send({})
        io.emit(Model.modelName + ' updated', instance)
      })
      .catch(function (err) {
        logger.error('Error updating %s with id=%s: %s', Model.modelName, req.params.id, err)
        logger.error('body: %s', req.body)

        res.status(500).send(err)
      })
    }

    function doDelete (req, res) {
      return Model.findById({_id: req.params.id}).exec()
      .then(instance => {
        return instance.remove().exec()
      })
      .then(result => {
        logger.info('Deleted %s with id=%s', Model.modelName, req.params.id)
        res.send({})
        io.emit(Model.modelName + ' deleted', req.params.id)
      })
      .catch(err => {
        logger.error('Error deleting %s with id=%s: %s', Model.modelName, req.params.id, err.message)
        res.status(500).send(err)
      })
    }

    function doGet (req, res) {
      selectFind(populateFind(Model.findById(req.params.id), req), req).exec()
      .then(function (instance) {
        res.send(instance)
      })
      .catch(function (err) {
        logger.error('Error getting %s with id=%s: %s', modelName, req.params.id, err)
        res.status(500).send(err)
      })
    }

    function doList (req, res) {
      listAction(Model, req, res)
    }

    function doCount (req, res) {
      countAction(Model, req, res)
    }

    return {
      Model: Model,
      logger: logger,
      setIo: function (_io) {
        io = _io
      },
      doList: doList,
      list: function (req, res) {
        doList(req, res)
      },
      doCount: doCount,
      count: function (req, res) {
        doCount(req, res)
      },
      doCreate: doCreate,
      create: function (req, res) {
        doCreate(req, res)
      },
      doGet: doGet,
      get: function (req, res) {
        doGet(req, res)
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
