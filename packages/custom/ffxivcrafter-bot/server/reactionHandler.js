'use strict'

var mongoose = require('mongoose')
var q = require('q')

var reactions

var BotReaction

function fetchReactions () {
  BotReaction = BotReaction || mongoose.model('BotReaction')

  return BotReaction.find()
  .lean()
  .exec()
  .then(result => {
    reactions = result
    return reactions
  })
  .catch(err => {
  })
}

function getReactions () {
  if(!reactions) return fetchReactions()
  return q.when(reactions)
}

module.exports = {
  fetchReactions: fetchReactions,
  getReactions: getReactions
}
