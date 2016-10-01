'use strict'

angular.module('mean.ffxivCrafter').factory('socket', ['$rootScope', function ($rootScope) {
  var io = require('socket.io-client')
  var socket = io.connect()

  return {
    on: function (eventName, callback) {
      socket.on(eventName, callback)
    },
    emit: function (eventName, data) {
      socket.emit(eventName, data)
    }
  }
}])
