'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ImageCommentSchema = new Schema({
  image: { type: Schema.ObjectId, ref: 'Image' },
  commentor: { type: Schema.ObjectId, ref: 'User' },
  text: { type: String },
  date: { type: Date, default: new Date() }
})

mongoose.model('ImageComment', ImageCommentSchema)
