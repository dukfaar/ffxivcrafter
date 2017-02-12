'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

var EventController = RestService.createRestController('Event')
EventController.list = function (req, res) {
  var q = {}

  if(req.query.startFrom || req.query.startTo) q.start = {}
  if(req.query.endFrom || req.query.endTo) q.end = {}

  if(req.query.startFrom) q.start.$gte = req.query.startFrom
  if(req.query.startTo) q.start.$lt = req.query.startTo
  if(req.query.endFrom) q.end.$gte = req.query.endFrom
  if(req.query.endTo) q.end.$lt = req.query.endTo

  RestService.list(EventController.Model.find(q), req)
  .then(function (result) {
    res.send(result)
  })
  .catch(function (err) {
    res.status(500).send(err)
  })
}

module.exports = RestService.createRestRoute(
  EventController,
  '/api/event'
)
