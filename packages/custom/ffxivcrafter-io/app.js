'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterIO = new Module('ffxivCrafter_io')


/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterIO.register(function (app, http, https) {
  var io = require(__dirname + '/server/config/socket')(https || http)

  FFXIVCrafterIO.io = io

  io.sockets.on('connection', function (socket) {
    console.log('Client Connected')

    socket.on('disconnect', function (socket) {
      console.log('Client Disconnected')
    })

    socket.on('error', function (err) {
      console.log('Error with socket:')
      console.log(err)
    })
  })

  FFXIVCrafterIO.angularDependencies([])

  return FFXIVCrafterIO
})
