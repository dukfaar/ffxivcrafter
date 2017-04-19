'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var EventUserSchema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User' },
  event: { type: Schema.ObjectId, ref: 'Event' },
  signedUp: { type: Date, default: new Date() }
})

mongoose.model('EventUser', EventUserSchema)
