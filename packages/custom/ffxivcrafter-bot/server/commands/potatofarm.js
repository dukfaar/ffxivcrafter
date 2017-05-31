'use strict'

let mongoose = require('mongoose')
let q = require('q')
let path = require('path')
mongoose.Promise = q.Promise

var logger = require('log4js').getLogger('app.bot.hire')

let config = require(path.join(__dirname, '../config/config.js'))

let farmingTimeouts = {
}

module.exports = function (botDef) {
  let commandRegex = /(potatofarm) ([0-9]*(\.[0-9]+)?)/i
  return {
    name: commandRegex,
    command: command
  }

  var User
  var UserDiscord

  function updateFarmResults (username, gold) {
    UserDiscord.findOne({discord: username})
    .exec().then(user => {
      user.gold += gold
      user.save().then(() => {
        logger.info('farming for user %s was successfull, added %s gold', user._id, gold)
        delete farmingTimeouts[user._id]
      })
    })
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    let attackerName = message.author.username + '#' + message.author.discriminator

    let regexResult = commandRegex.exec(message)
    let farmDuration_h = Number.parseFloat(regexResult[2])
    let farmDuration_m = farmDuration_h * 60
    let farmDuration_s = farmDuration_m * 60
    let farmDuration_ms = farmDuration_s * 1000

    UserDiscord.findOne({discord: attackerName})
    .exec().then(user => {
      if (!user) throw new Error('User is not known')

      if (!farmingTimeouts[user._id]) {
        farmingTimeouts[user._id] = setTimeout(() => {
          updateFarmResults(attackerName, farmDuration_s * config.bot.game.potatofarm.goldPerSecond)
        }, farmDuration_ms)

        logger.info('Farming started for user %s for %ss', user._id, farmDuration_s)
        message.channel.send('Farming has begun! You will finish in ' + farmDuration_m + ' minutes.')
      } else {
        logger.info('User %s tried working while work is already in progress', user._id)
        message.channel.send('Your farming is already in progress.')
      }
    })
    .catch(err => {
      logger.error(err)
      message.channel.send('Sorry something went wrong there. *smashes head against a wall*')
    })
  }
}
