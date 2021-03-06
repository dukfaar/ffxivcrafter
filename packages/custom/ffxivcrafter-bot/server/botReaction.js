'use strict'

var _ = require('lodash')

var reactionHandler = require('./reactionHandler')

var logger = require('log4js').getLogger('app.bot.reactions')

const NO_SUITABLE_REACTIONS = 'no suitable reactions to pick from'

function NoSuitableReactionsException () {}

module.exports = function (botDef) {
  return {
    process: processMessage
  }

  function filterByTrigger (reactions, message) {
    return _.filter(reactions, reaction => {
      let regex = new RegExp(reaction.trigger)
      return regex.test(message)
    })
  }

  function filterByCooldown (reactions) {
    let now = new Date().getTime()

    return _.filter(reactions, reaction => {
      if (reaction.lastReaction && reaction.cooldown) {
        let age = now - reaction.lastReaction.getTime()
        logger.debug('age: %s', age)
        return age > (reaction.cooldown * 1000)
      } else {
        return true
      }
    })
  }

  function filterByProbability (reactions) {
    return _.filter(reactions, reaction => {
      let value = _.random(1, true)
      return (reaction.probability || 0) > value
    })
  }

  function getRandomReaction (reactions) {
    if (reactions.length === 0) {
      logger.debug(NO_SUITABLE_REACTIONS)
      throw new NoSuitableReactionsException()
    }

    return _.sample(reactions)
  }

  function processMessage (message) {
    reactionHandler.getReactions()
    .then(reactions => filterByTrigger(reactions, message))
    .then(filterByCooldown)
    .then(filterByProbability)
    .then(getRandomReaction)
    .then(reaction => {
      message.channel.send(reaction.reaction)

      reaction.lastReaction = new Date()
      reaction.save()

      botDef.io.to('discordBot').emit('sent reaction', {reaction: reaction, message: _.pick(message,['content', 'author.id', 'author.username', 'author.discriminator', 'channel.id'])})
    })
    .catch(err => {
      if (err instanceof NoSuitableReactionsException) {
        // No real error
      } else {
        logger.error('Error while processing message: %s', JSON.stringify(err))
      }
    })
  }
}
