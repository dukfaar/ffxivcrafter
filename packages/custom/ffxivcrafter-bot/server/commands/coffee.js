'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: /coffee/i,
    command: command
  }

  var User
  var UserDiscord

  function coffeeString (name) {
    return 'Good morning! (づ ￣ ³￣)づ\u2615 ' + name
  }

  function command (params, message) {
    var commandLessParams = _.slice(params, 1)
    message.channel.sendMessage(coffeeString(commandLessParams))
  }
}
