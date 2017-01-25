'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var EventSchema = new Schema({
  title: { type: String, default: 'New Event' },
  description: { type: String, default: '' },
  start: { type: Date, default: new Date() },
  end: { type: Date, default: new Date() }
})

mongoose.model('Event', EventSchema)
