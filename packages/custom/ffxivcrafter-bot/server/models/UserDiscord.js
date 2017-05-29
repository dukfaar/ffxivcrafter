'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  user: { type: Schema.ObjectId, ref: 'User' },
  discord: {type: String},
  murderAttempts: {type: Number, default: 0},
  rcHugs: {type: Number, default: 0},
  zombies: {type: Number, default: 0},
  gold: {type: Number, default: 0}
}

var UserDiscordSchema = new Schema(schemaDefinition)

mongoose.model('UserDiscord', UserDiscordSchema)
