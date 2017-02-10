'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ForumPostSchema = new Schema({
  text: { type: String, default: '' },
  thread: { type: Schema.ObjectId, ref: 'ForumThread' },
  creator: { type: Schema.ObjectId, ref: 'User' },
  created: { type: Date, default: new Date() },
  lastEdited: { type: Date }
})

mongoose.model('ForumPost', ForumPostSchema)
