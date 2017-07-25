'use strict'

let mongoose = require('mongoose')
var _ = require('lodash')

var logger = require('log4js').getLogger('app.bot.facts')

const NO_SUITABLE_FACTS = 'no suitable fact to pick from'

function NoSuitableFactsException () {}

module.exports = function (botDef) {
  return {
    name: /fact/i,
    command: command
  }

  var UselessFact

  function filterByCooldown (facts) {
    let now = new Date().getTime()

    return _.filter(facts, fact => {
      if (fact.lastSaid && fact.cooldown) {
        let age = now - fact.lastSaid.getTime()
        return age > (fact.lastSaid * 1000)
      } else {
        return true
      }
    })
  }

  function getRandomFact (facts) {
    if (facts.length === 0) {
      logger.debug(NO_SUITABLE_FACTS)
      throw new NoSuitableFactsException()
    }

    return _.sample(facts)
  }

  function command (params, message) {
    UselessFact = UselessFact || mongoose.model('UselessFact')

    UselessFact.find({}).exec()
    .then(filterByCooldown)
    .then(getRandomFact)
    .then(result => {
      message.channel.send(result.fact)

      result.lastSaid = new Date()
      result.save()
    })
    .catch(err => {
      if (err instanceof NoSuitableFactsException) {
        // No real error
      } else {
        logger.error('Error while processing message: %s', err)
      }
    })
  }
}
