'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  user: { type: Schema.ObjectId, ref: 'User' },
  rank: { type: Schema.ObjectId, ref: 'Rank' }
}

var UserRankSchema = new Schema(schemaDefinition)

mongoose.model('UserRank', UserRankSchema)
