'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'hug',
    command: command
  }

  var User
  var UserDiscord

  function hugString (name) {
    return '(>･ｪ･)>' + name + '<(･ｪ･<)'
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    var discordName = message.author.username + '#' + message.author.discriminator

    var commandLessParams = _.slice(params, 1)

    if (params.length > 1 && !_.includes(commandLessParams, botDef.commandTrigger)) {
      message.channel.sendMessage(hugString(_.join(commandLessParams, ' ')))
    } else {
      var responses = ['That\'s cute, but i don\'t know how to hug myself.\n']

      UserDiscord.findOne({discord: discordName})
      .populate('user', 'username')
      .exec()
      .then((userDiscord) => {
        if (userDiscord) {
          userDiscord.rcHugs = (userDiscord.rcHugs || 0) + 1
          userDiscord.save()

          responses.push(hugString(userDiscord.user.username))
        } else {
          responses.push('Actually... who are you? Would you tell me please?')
        }
      })
      .then(() => {
        message.channel.sendMessage(responses.join(' '))
      })
    }
  }
}
