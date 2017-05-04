'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'choke',
    command: command
  }

  var User
  var UserDiscord

  function chokeString (name) {
    return 'ψ(*｀ー´)ψ             :dizzy_face: ' + name + ' :dizzy_face:'
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    var discordName = message.author.username + '#' + message.author.discriminator

    var commandLessParams = _.slice(params, 1)

    if (params.length > 1 && !_.includes(commandLessParams, botDef.commandTrigger)) {
      message.channel.sendMessage(chokeString(_.join(commandLessParams, ' ')))
    } else {
      var responses = []

      UserDiscord.findOne({discord: discordName})
      .exec()
      .then((userDiscord) => {
        if (userDiscord) {
          userDiscord.murderAttempts += 1
          userDiscord.save()

          return User.findById(userDiscord.user)
          .select('race username')
          .lean()
          .exec()
          .then(user => {
            responses.push('The emperor does not agree. Die, rebell scum!')
            responses.push('\n' + chokeString(user.username))
          })
        } else {
          responses.push('Now, thats a bit harsh isn\'t it?')
          responses.push('\nI don\'t even know you!')
        }
      })
      .then(() => {
        message.channel.sendMessage(responses.join(' '))
      })
    }
  }
}
