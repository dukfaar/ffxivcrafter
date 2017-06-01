'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  user: { type: Schema.ObjectId, ref: 'User' },
  farmStart: {type: Date, default: undefined},
  farmDuration: {type: Number, default: 0}
}

var GameStatsSchema = new Schema(schemaDefinition)

mongoose.model('GameStats', GameStatsSchema)
