'use strict'

var Module = require('meanio').Module

var FFXIVCrafterIO = new Module('ffxivCrafter_io')

var logger = require('log4js').getLogger('app.io')

const path = require('path')

FFXIVCrafterIO.register(function (app, http) {
console.log("io reg")
  var io = require(path.join(__dirname, '/server/config/socket'))(http)

  FFXIVCrafterIO.io = io

  io.sockets.on('connection', function (socket) {
    logger.info('Client Connected')

    socket.on('disconnect', function (socket) {
      logger.info('Client Disconnected')
    })

    socket.on('error', function (err) {
      logger.error('Error with socket:')
      logger.error(err)
    })

    socket.on('room join', roomName => {
      socket.join(roomName, err => {
        if (!err) logger.info('User joined the room ' + roomName + ' and is now in the rooms ' + Object.keys(socket.rooms))
        else logger.error('User could not join room: ' + err)
      })
    })

    socket.on('room leave', roomName => {
      socket.leave(roomName, err => {
        if (!err) logger.info('User left the room ' + roomName + ' and is now in the rooms ' + Object.keys(socket.rooms))
        else logger.error('User could not leave room: ' + err)
      })
    })
  })

  FFXIVCrafterIO.angularDependencies([])

  return FFXIVCrafterIO
})
