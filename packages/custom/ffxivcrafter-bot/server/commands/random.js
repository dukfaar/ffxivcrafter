'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

var mongoose = require('mongoose')

var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'random',
    command: command
  }

  function modifyQuery (query) {
    if (query.tags) {
      query.tags = { $regex: new RegExp(query.tags, 'i') }
    }
    return query
  }

  function command (params, message) {
    let req = {
      query: params.length > 1 ? modifyQuery({tags: params[1]}) : ''
    }

    var Image = mongoose.model('Image')

    RestService.countOperation(Image, req.query)
    .then((c) => {
      if (c > 0) {
        req.query.limit = 1
        req.query.skip = _.random(0, c - 1)
        RestService.listOperation(Image, req)
        .then((result) => {
          message.channel.sendMessage('https://www.dukfaar.com/api/imageData/' + result[0]._id)
        })
      } else {
        message.channel.sendMessage('Sorry i couldn\'t find anything :-(')
      }
    })
  }
}
