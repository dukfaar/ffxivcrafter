'use strict'

let mongoose = require('mongoose')
let _ = require('lodash')
let q = require('q')
let path = require('path')
mongoose.Promise = q.Promise

var logger = require('log4js').getLogger('app.bot.hire')

let config = require(path.join(__dirname, '../config/config.js'))

module.exports = function (botDef) {
  let commandRegex = /(hire) ([0-9]+) (zombie|zombies)/i
  return {
    name: commandRegex,
    command: command
  }

  var User
  var UserDiscord

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    let attackerName = message.author.username + '#' + message.author.discriminator

    let regexResult = commandRegex.exec(message)
    let amount = Number.parseInt(regexResult[2])
    let cost = amount * config.bot.game.units.zombies.cost

    UserDiscord.findOne({discord: attackerName})
    .exec().then(user => {
      if (!user) throw new Error('User is not known')

      if (cost <= user.gold) {
        user.gold -= cost
        user.zombies += amount
        return user.save()
        .then(() => {
          message.channel.send('Zombies have been hired. I hope you can feed them all.')
          logger.info('User %s has hired %s zombies.', user._id, amount)
        })
      } else {
        message.channel.send('You don\'t have enough gold to hire those zombies. Poor bastard.')
        logger.info('User %s was too poor to hire %s zombies', user._id, amount)
      }
    })
    .catch(err => {
      logger.error(err)
      message.channel.send('Sorry something went wrong there. *smashes head against a wall*')
    })
  }
}
