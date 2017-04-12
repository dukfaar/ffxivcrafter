'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  name: { type: String, default: '' }
}

var RankSchema = new Schema(schemaDefinition)

mongoose.model('Rank', RankSchema)
