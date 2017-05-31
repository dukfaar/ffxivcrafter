'use strict'

var q = require('q')

var mongoose = require('mongoose')

module.exports = function (botDef) {
  var commandRegex = /([iI] am|[iI]'m) (.*)/

  return {
    name: commandRegex,
    command: command
  }

  var UserDiscord
  var User

  function command (params, message) {
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    User = User || mongoose.model('User')

    var discordName = message.author.username + '#' + message.author.discriminator
    var usernameParameter = commandRegex.exec(message)[2]

    q.spread([
      UserDiscord.findOne({discord: discordName}).lean().exec(),
      User.findOne({ $or: [{name: usernameParameter}, {username: usernameParameter}, {email: usernameParameter}]}).lean().exec()
    ], (userDiscord, user) => {
      if (userDiscord) {
        message.channel.sendMessage('You already told me who you are.')
      } else if (!user) {
        message.channel.sendMessage('I can\'t find a user with that name.')
      } else if (!userDiscord && user) {
        let newUserDiscord = new UserDiscord()
        newUserDiscord.user = user
        newUserDiscord.discord = discordName
        newUserDiscord.save().then((newInstance) => {
          message.channel.sendMessage('Hello ' + user.name + '. Happy to burn you!\n(ﾉ･ｪ･)ﾉ –==≡炎炎炎炎炎炎炎炎' + user.name + '炎炎炎')
        })
      }
    }, err => {
      console.log('DISCORD-COMMAND-ERROR: ' + err)
    })
  }
}
