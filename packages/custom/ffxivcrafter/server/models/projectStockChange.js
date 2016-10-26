'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ProjectStockChangeSchema = new Schema({
  project: { type: Schema.ObjectId, ref: 'CraftingProject' },
  submitter: { type: Schema.ObjectId, ref: 'User' },
  item: { type: Schema.ObjectId, ref: 'Item' },
  amount: { type: Number, default: 0 },
  hq: { type: Boolean, default: false },
  date: { type: Date, default: new Date() }
})

mongoose.model('ProjectStockChange', ProjectStockChangeSchema)
