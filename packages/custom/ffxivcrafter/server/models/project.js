'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CraftingProjectSchema = new Schema({
  tree: { type: Schema.ObjectId, ref: 'ProjectStep' },
  creator: { type: Schema.ObjectId, ref: 'User'},
  stock: [{
    item: { type: Schema.ObjectId, ref: 'Item'},
    amount: { type: Number, default: 0 },
    hq: { type: Boolean, default: false }
  }],
  public: { type: Boolean, default: false },
  comment: { type: String, default: '' }
})

mongoose.model('CraftingProject', CraftingProjectSchema)
