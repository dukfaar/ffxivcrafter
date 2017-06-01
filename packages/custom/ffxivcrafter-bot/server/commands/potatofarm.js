'use strict'

let mongoose = require('mongoose')
let q = require('q')
let _ = require('lodash')
let path = require('path')
mongoose.Promise = q.Promise

var logger = require('log4js').getLogger('app.bot.potatofarm')

let config = require(path.join(__dirname, '../config/config.js'))

let farmingTimeouts = {
}

module.exports = function (botDef) {
  setTimeout(initTimeouts, 5000)

  let commandRegex = /(potatofarm) ([0-9]*(\.[0-9]+)?)/i
  return {
    name: commandRegex,
    command: command
  }

  var User
  var UserDiscord
  var GameStats

  function findOrCreateGameStats (user) {
    return GameStats.findOne({user: user}).exec()
    .then(gamestats => {
      if (gamestats) return gamestats

      logger.info('need to create new gamestat')

      let newstats = new GameStats()
      newstats.user = user
      return newstats
    })
  }

  function updateFarmResults (id, gold) {
    UserDiscord.findOne({_id: id})
    .exec().then(userDiscord => {
      userDiscord.gold += gold
      userDiscord.save().then(() => {
        logger.info('farming for user %s was successfull, added %s gold', userDiscord._id, gold)
        delete farmingTimeouts[userDiscord._id]

        findOrCreateGameStats(userDiscord.user)
        .then(gamestats => {
          gamestats.farmStart = undefined
          gamestats.farmDuration = 0
          gamestats.save()
        })
      })
    })
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    GameStats = GameStats || mongoose.model('GameStats')

    let attackerName = message.author.username + '#' + message.author.discriminator

    let regexResult = commandRegex.exec(message)
    let farmDuration_h = Number.parseFloat(regexResult[2])
    let farmDuration_m = farmDuration_h * 60
    let farmDuration_s = farmDuration_m * 60
    let farmDuration_ms = farmDuration_s * 1000

    UserDiscord.findOne({discord: attackerName})
    .exec().then(userDiscord => {
      if (!userDiscord) throw new Error('User is not known')

      if (!farmingTimeouts[userDiscord._id]) {
        farmingTimeouts[userDiscord._id] = setTimeout(() => {
          updateFarmResults(userDiscord._id, farmDuration_s * config.bot.game.potatofarm.goldPerSecond)
        }, farmDuration_ms)

        findOrCreateGameStats(userDiscord.user)
        .then(gamestats => {
          gamestats.farmStart = new Date()
          gamestats.farmDuration = farmDuration_ms
          logger.info(gamestats)
          gamestats.save()
          .then(()=> logger.info('gamestats saved'))
          .catch(logger.error)
        })

        logger.info('Farming started for user %s for %ss', userDiscord._id, farmDuration_s)
        message.channel.send('Farming has begun! You will finish in ' + farmDuration_m + ' minutes.')
      } else {
        logger.info('User %s tried working while work is already in progress', userDiscord._id)
        message.channel.send('Your farming is already in progress.')
      }
    })
    .catch(err => {
      logger.error(err)
      message.channel.send('Sorry something went wrong there. *smashes head against a wall*')
    })
  }

  function checkGameStats (gamestats) {
    if (gamestats.farmStart && gamestats.farmDuration) {
      let now = new Date()
      let nowMs = now.getTime()

      let thenMs = gamestats.farmStart.getTime() + gamestats.farmDuration

      let distance = thenMs - nowMs
      let farmDuration_ms = distance

      UserDiscord.findOne({user: gamestats.user})
      .exec().then(userDiscord => {

        if (farmDuration_ms > 0) {
          logger.info('Restarted farm command for user %s, %s ms remaining', userDiscord.user, farmDuration_ms)

          farmingTimeouts[userDiscord._id] = setTimeout(() => {
            updateFarmResults(userDiscord._id, (gamestats.farmDuration / 1000) * config.bot.game.potatofarm.goldPerSecond)
          }, farmDuration_ms)
        } else {
          logger.info('Farming for user %s already done, processing', userDiscord.user)
          updateFarmResults(userDiscord._id, (gamestats.farmDuration / 1000) * config.bot.game.potatofarm.goldPerSecond)
        }
      })
    }
  }

  function initTimeouts () {
    GameStats = GameStats || mongoose.model('GameStats')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    GameStats.find({}).exec().then(stats => {
      _.forEach(stats, checkGameStats)
    })
  }
}
