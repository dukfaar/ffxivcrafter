'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: /gamestats/i,
    command: command
  }

  var UserDiscord

  function command (params, message) {
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    var discordName = message.author.username + '#' + message.author.discriminator

    UserDiscord.findOne({discord: discordName}).lean().exec()
    .then(userDiscord => {
      let sentences = []

      if(userDiscord) {
        sentences.push('You currently have ' + (userDiscord.gold || 0) + ' gold.')
        sentences.push('You have ' + (userDiscord.zombies || 0) + ' zombies.')
      } else {
        sentences.push('Sorry, i have no idea who you are.')
      }

      message.channel.send(_.join(sentences, '\n'))
    })
  }
}
