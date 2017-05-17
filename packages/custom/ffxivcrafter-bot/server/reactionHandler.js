'use strict'

var mongoose = require('mongoose')
var q = require('q')
mongoose.Promise = q.Promise

var logger = require('log4js').getLogger('app.bot.reactionhandler')

var reactions
var BotReaction

function fetchReactions () {
  BotReaction = BotReaction || mongoose.model('BotReaction')

  logger.info('fetching BotReactions from Database')

  return BotReaction.find()
  .exec()
  .then(result => {
    logger.info('BotReaction successfully loaded')
    reactions = result
    return reactions
  })
  .catch(err => {
    logger.error('Error fetching BotReactions: %s', err)
    reactions = []
  })
}

function getReactions () {
  if (!reactions) return fetchReactions()
  return q.when(reactions)
}

module.exports = {
  fetchReactions: fetchReactions,
  getReactions: getReactions
}
