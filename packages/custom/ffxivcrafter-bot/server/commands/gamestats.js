'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: /gamestats/i,
    command: command
  }

  var UserDiscord
  var GameStats

  function command (params, message) {
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    GameStats = GameStats || mongoose.model('GameStats')

    var discordName = message.author.username + '#' + message.author.discriminator
    let sentences = []

    UserDiscord.findOne({discord: discordName}).lean().exec()
    .then(userDiscord => {
      if(userDiscord) {
        sentences.push('You currently have ' + (userDiscord.gold || 0) + ' gold.')
        sentences.push('You have ' + (userDiscord.zombies || 0) + ' zombies.')
      } else {
        sentences.push('Sorry, i have no idea who you are.')
      }

      return GameStats.findOne({user: userDiscord.user}).exec()
    })
    .then(gamestats => {
      if (gamestats && gamestats.farmStart && gamestats.farmDuration) {
        let now = new Date()
        let nowMs = now.getTime()

        let thenMs = gamestats.farmStart.getTime() + gamestats.farmDuration

        let distance = thenMs - nowMs

        sentences.push('You are currently farming potatos. Time to complete: ' + (distance / 1000) + ' seconds.')
      }
    })
    .then(() => {
      message.channel.send(_.join(sentences, '\n'))
    })
  }
}
