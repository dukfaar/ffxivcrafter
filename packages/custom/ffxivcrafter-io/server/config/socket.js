'use strict'

var socketio = require('socket.io')

var io = null

module.exports = function (http) {
  if(!io) {
    io = socketio.listen(http)

    io.use(function (socket, next) {
      next()
    })
  }

  return io
}
