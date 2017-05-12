'use strict'

var mongoose = require('mongoose')
var q = require('q')

var reactions

var BotReaction

function fetchReactions () {
  BotReaction = BotReaction || mongoose.model('BotReaction')

  console.log('fetching')

  return BotReaction.find()
  .lean()
  .exec()
  .then(result => {
    console.log('fetched')
    reactions = result
    return reactions
  })
  .catch(err => {
    console.log('error while fetching %s', err)
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
