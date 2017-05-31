'use strict'

let mongoose = require('mongoose')
let _ = require('lodash')
let q = require('q')
let path = require('path')
mongoose.Promise = q.Promise

var logger = require('log4js').getLogger('app.bot.raid')

let config = require(path.join(__dirname, '../config/config.js'))

module.exports = function (botDef) {
  let commandRegex = /(raid) (.*) ([0-9]+)/i
  return {
    name: commandRegex,
    command: command
  }

  var User
  var UserDiscord

  function getAttacker (attackerName) {
    return UserDiscord.findOne({discord: attackerName}).exec().then(ud => {
      if (!ud) throw new Error('User is not known')
      return ud
    })
  }

  function getVictim (victimName) {
    return UserDiscord.findOne({discord: victimName}).exec()
    .then(victim => {
      if (victim) {
        return victim
      } else {
        return User.findOne({$or: [{name: victimName}, {username: victimName}, {email: victimName}]})
        .lean().exec()
        .then(victimUser => {
          if (!victimUser) throw new Error('No User found for ' + victimName)
          return UserDiscord.findOne({user: victimUser._id}).exec()
        })
        .catch(err => {
          logger.error('Error fetching User %s: %s', victimName, err)
        })
      }
    })
  }

  function determineStolenGoldAmount (attacker, victim, attackZombies) {
    logger.info('%s zombies are left for stealing.', attackZombies)
    let stealAmount = 0
    stealAmount += attackZombies * config.bot.game.units.zombies.stealAmount

    logger.info('They can steal %s gold from the victim', stealAmount)

    stealAmount = Math.min(victim.gold, stealAmount)

    logger.info('%s from %s gold is now gone.', stealAmount, victim.gold)

    victim.gold -= stealAmount
    attacker.gold += stealAmount

    return stealAmount
  }

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')

    let attackerName = message.author.username + '#' + message.author.discriminator

    let regexResult = commandRegex.exec(message)
    let victimName = regexResult[2]
    let amount = Number.parseInt(regexResult[3])

    q.all([
      getAttacker(attackerName),
      getVictim(victimName)
    ])
    .spread((attacker, victim) => {
      if (!config.bot.game.allowSelfRaiding && attacker._id.toString() === victim._id.toString()) {
        message.channel.send('Attack yourself? Let me think about that...')
        setTimeout(() => { message.channel.send('Short answer: NO!') }, 3000)
        setTimeout(() => { message.channel.send('Long answer: HELL NO!') }, 15000)
      } else if (attacker.zombies >= amount) {
        let attackZombies = amount
        let defendZombies = victim.zombies

        let deadAttackZombies = 0
        let deadDefendZombies = 0

        logger.info('launching an attack with %s zombies on %s zombies', attackZombies, defendZombies)

        _.forEach(_.range(attackZombies), i => {
          let killDef = _.random(0, 1, true)

          if (defendZombies > 0 && defendZombies > deadDefendZombies && killDef < config.bot.game.units.zombies.killProbabilities.zombies) deadDefendZombies += 1
        })

        defendZombies -= deadDefendZombies

        _.forEach(_.range(defendZombies), i => {
          let killAtt = _.random(0, 1, true)

          if (attackZombies > 0 && attackZombies > deadAttackZombies && killAtt < config.bot.game.units.zombies.killProbabilities.zombies) deadAttackZombies += 1
        })

        attackZombies -= deadAttackZombies

        attacker.zombies -= deadAttackZombies
        victim.zombies -= deadDefendZombies

        let stealAmount = determineStolenGoldAmount(attacker, victim, attackZombies)

        attacker.save()
        victim.save()

        message.channel.send('You lost ' + deadAttackZombies + ' while killing ' + deadDefendZombies)
        if(stealAmount > 0) {
          message.channel.send('Your hordes managed to steal ' + stealAmount + ' gold from your poor victim.')
        } else {
          message.channel.send('You failed at stealing gold. Your zombies died in vain.')
        }
      } else {
        message.channel.send('You dont have have that many zombies. Maybe you should buy some?')
      }
    })
    .catch(err => {
      logger.error('Error while handling raid command: %s', err.toString())
    })
  }
}
