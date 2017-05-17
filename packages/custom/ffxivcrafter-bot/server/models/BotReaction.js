'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  trigger: { type: String },
  reaction: { type: String },
  probability: { type: Number },
  lastReaction: { type: Date },
  cooldown: { type: Number }
}

var BotReactionSchema = new Schema(schemaDefinition)

mongoose.model('BotReaction', BotReactionSchema)
