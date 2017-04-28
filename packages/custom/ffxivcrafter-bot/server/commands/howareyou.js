'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')
var os = require('os')
var process = require('process')

module.exports = function (botDef) {
  return {
    name: 'how are you',
    command: command
  }

  var UserDiscord

  function command (params, message) {
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    UserDiscord.find().lean().exec().then((discordUsers) => {
      let sentences = []

      let totalMurders = _.reduce(discordUsers, (sum, u) => { return sum + u.murderAttempts }, 0)
      let totalHugs = _.reduce(discordUsers, (sum, u) => { return sum + u.rcHugs }, 0)

      sentences.push('My house was built ' + os.uptime() + ' seconds ago')
      sentences.push('I am awake since ' + process.uptime() + ' seconds')

      let cpus = os.cpus()
      let totalThinks = _.reduce(cpus, (sum, c) => { return sum + c.speed }, 0)

      sentences.push('I have ' + cpus.length + ' brain(s) doing ' + totalThinks + ' million thinkings per second')
      sentences.push('In the last 15 minutes i was thinking exactly(!) this hard: ' + os.loadavg()[2])

      sentences.push('So far people tried to kill me ' + totalMurders + ' times.')
      sentences.push('And i have been hugged ' + totalHugs + ' times.')

      message.channel.sendMessage(_.join(sentences, '\n'))
    })
  }
}
