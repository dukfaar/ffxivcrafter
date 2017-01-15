'use strict'

angular.module('mean.ffxivCrafter').factory('socket', ['$rootScope', function ($rootScope) {
  var io = require('socket.io-client')
  var socket = io.connect()

  socket.on('error', function (err) {
    console.log('Error with the socket')
    console.log(err)
  })

  return {
    on: function (eventName, callback) {
      socket.on(eventName, callback)
    },
    emit: function (eventName, data) {
      socket.emit(eventName, data)
    },
    off: function (eventName, data) {
      socket.removeListener(eventName, data)
    }
  }
}])
