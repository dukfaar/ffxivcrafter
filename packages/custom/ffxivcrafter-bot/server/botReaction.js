'use strict'

var _ = require('lodash')

var reactionHandler = require('./reactionHandler')

module.exports = function (botDef) {
  return {
      process: processMessage
  }

  function processMessage(message) {
    reactionHandler.getReactions().then(reactions => {
      let matchingReactions = _.filter(reactions, reaction => {
        let regex = new RegExp(reaction.trigger)
        return regex.test(message)
      })

      let probabilityReactions = _.filter(matchingReactions, reaction => {
        let value = _.random(1, true)
        return (reaction.probability || 0) > value
      })

      if(probabilityReactions.length > 0) {
        message.channel.send(_.sample(probabilityReactions).reaction)
      }
    })
  }
}
