'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var AirshipPartSchema = new Schema({
  name: { type: String, default: 'New Part' },
  slot: { type: String, enum: ['Hull', 'Rigging', 'Forecastle', 'Aftercastle'], default: 'Hull' },
  rank: { type: Number, default: 1 },
  components: { type: Number, default: 0 },
  survaillance: { type: Number, default: 0 },
  retrieval: { type: Number, default: 0 },
  speed: { type: Number, default: 0 },
  range: { type: Number, default: 0 },
  favor: { type: Number, default: 0 }
})

mongoose.model('AirshipPart', AirshipPartSchema)
