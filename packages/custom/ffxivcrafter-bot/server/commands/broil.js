'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'broil',
    command: command
  }

  var User
  var UserDiscord

  function broilString (name) {
    return '(ﾉ･ｪ･)ﾉ –==≡炒炒炒炒炒炒炒炒炒炒' + name + '炒炒炒'
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    var discordName = message.author.username + '#' + message.author.discriminator

    var commandLessParams = _.slice(params, 1)

    if (params.length > 1 && !_.includes(commandLessParams, botDef.commandTrigger)) {
      message.channel.sendMessage(broilString(_.join(commandLessParams, ' ')))
    } else {
      var responses = ['You want to broil me?']

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
            responses.push('What do you think i am? A lalafell? Get lost,')
            switch (user.race) {
              case 'Miqo\'te':
                responses.push('you furball.')
                break
              case 'Elezen':
                responses.push('you pointy eared berry muncher.')
                break
              case 'Au Ra':
                responses.push('lizard.')
                break
              case 'Lalafell':
                responses.push('you evil thief.')
                break
              case 'Hyur':
                responses.push('derplander.')
                break
              case 'Roegadyn':
                responses.push('you dim witted giant.')
                break
              default:
                responses.push('funny creature.')
                break
            }
            responses.push('\n' + broilString(user.username))
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
