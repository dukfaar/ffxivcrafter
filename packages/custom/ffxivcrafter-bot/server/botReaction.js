'use strict'

var _ = require('lodash')

var reactionHandler = require('./reactionHandler')

module.exports = function (botDef) {
  return {
      process: process
  }

  function process(message) {
    reactionHandler.getReactions().then(reactions => {
      let matchingReactions = _.filter(reactions, reaction => new RegExp(reaction.trigger).test(message))

      if(matchingReactions.length > 0) {
        message.channel.send(matchingReactions[0].reaction)
      }
    })  
  }
}
