'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ImageSchema = new Schema({
  uploader: { type: Schema.ObjectId, ref: 'User' },
  filetype: { type: String },
  uploadDate: { type: Date, default: new Date() },
  tags: [{type: String}]
})

mongoose.model('Image', ImageSchema)
