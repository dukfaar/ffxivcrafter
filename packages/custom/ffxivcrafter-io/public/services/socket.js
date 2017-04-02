'use strict'

angular.module('mean.ffxivCrafter_io').factory('socket', SocketFactory)

SocketFactory.$inject = ['$rootScope']

function SocketFactory ($rootScope) {
  var io = require('socket.io-client')
  var socket = io.connect()

  socket.on('error', function (err) {
    console.log('Error with the socket')
    console.log(err)
  })

  return {
    on: on,
    emit: emit,
    off: off,
    auto: auto
  }

  function on (eventName, callback) {
    socket.on(eventName, callback)
  }

  function emit (eventName, data) {
    socket.emit(eventName, data)
  }

  function off (eventName, callback) {
    socket.removeListener(eventName, callback)
  }

  function auto (eventName, callback, scope) {
    socket.on(eventName, callback)
    scope.$on('$destroy', () => {
      socket.off(eventName, callback)
    })
  }
}
