'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ImageSchema = new Schema({
  uploader: { type: Schema.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: new Date() }
})

mongoose.model('Image', ImageSchema)
