'use strict'

var _ = require('lodash')
var q = require('q')

var mongoose = require('mongoose')

module.exports = function (botDef) {
  return {
    name: 'i am',
    command: command
  }

  var UserDiscord
  var User

  function command (params, message) {
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    User = User || mongoose.model('User')

    var discordName = message.author.username + '#' + message.author.discriminator
    var usernameParameter = _.join(_.slice(params, 2), ' ')

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
