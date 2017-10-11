'use strict'

var socketio = require('socket.io')

var io = null

module.exports = function (http, https) {
  if(!io) {
    io = new socketio()
    
    if (http) io.attach(http)
    if (https) io.attach(https)

    io.use(function (socket, next) {
      next()
    })
  }

  return io
}
