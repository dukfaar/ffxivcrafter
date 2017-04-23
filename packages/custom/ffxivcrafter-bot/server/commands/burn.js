'use strict'

var mongoose = require('mongoose')

module.exports = function (botDef) {
  return {
    name: 'burn',
    command: command
  }

  var User
  var UserDiscord

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord  = UserDiscord || mongoose.model('UserDiscord')

    var discordName = message.author.username + '#' + message.author.discriminator

    if (params.length > 1 && params[1] !== botDef.commandTrigger) {
      message.channel.sendMessage('(ﾉ･ｪ･)ﾉ –==≡炎炎炎炎炎炎炎炎' + params[1] + '炎炎炎')
    } else {
      var responses = ['You tried burning me?']

      UserDiscord.findOne({discord: discordName})
      .exec()
      .then((userDiscord) => {
        userDiscord.murderAttempts += 1
        userDiscord.save()

        if(userDiscord) {
          return User.findById(userDiscord.user)
          .select('race username')
          .lean()
          .exec()
          .then(user => {
            responses.push('I will remember that,')
            switch(user.race) {
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
            responses.push('\n(ﾉ･ｪ･)ﾉ –==≡炎炎炎炎炎炎炎炎' + user.username + '炎炎炎')
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
