'use strict'

'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var NewsletterSchema = new Schema({
  title: { type: String, default: '' },
  uploader: { type: Schema.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: new Date() },
  format: { type: String, enum: ['pdf'] },
  isCurrent: { type: Boolean, default: false }
})

mongoose.model('Newsletter', NewsletterSchema)
