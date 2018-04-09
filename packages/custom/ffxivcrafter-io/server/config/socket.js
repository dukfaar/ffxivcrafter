'use strict'

var socketio = require('socket.io')

var io = null

module.exports = function (http) {
  if(!io) {
    io = new socketio()
    
    if (http) io.attach(http)

    io.use(function (socket, next) {
      next()
    })
  }

  return io
}
