'use strict'

var RestService = require('../../../ffxivcrafter/server/services/RestService')()
var BotReactionHandler = require('../reactionHandler')

var controller = RestService.createRestController('BotReaction')

controller.create = (req, res) => {
  controller.doCreate(req, res)
  .then(() => {
    BotReactionHandler.fetchReactions()
  })
}

controller.update = (req, res) => {
  controller.doUpdate(req, res)
  .then(() => {
    BotReactionHandler.fetchReactions()
  })
}

controller.delete = (req, res) => {
  controller.doDelete(req, res)
  .then(() => {
    BotReactionHandler.fetchReactions()
  })
}

module.exports = RestService.createRestRoute(
  controller,
  '/api/rest/botreaction'
)
