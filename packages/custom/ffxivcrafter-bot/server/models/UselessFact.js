'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  fact: { type: String },
  lastSaid: { type: Date },
  cooldown: { type: Number }
}

var UselessFactSchema = new Schema(schemaDefinition)

mongoose.model('UselessFact', UselessFactSchema)
