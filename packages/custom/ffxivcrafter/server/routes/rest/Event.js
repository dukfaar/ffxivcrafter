'use strict'

var RestService = require('../../services/RestService')()

var EventController = RestService.createRestController('Event')
EventController.list = function (req, res) {
  var q = {
    start: {
      $gte: req.query.startFrom ? req.query.startFrom : new Date(),
      $lt: req.query.startTo ? req.query.startTo : new Date()
    }
  }

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
