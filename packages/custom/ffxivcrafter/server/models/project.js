'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var CraftingProjectSchema = new Schema({
  name: { type: String, default: ''},
  tree: { type: Schema.ObjectId, ref: 'ProjectStep' },
  creator: { type: Schema.ObjectId, ref: 'User'},
  sharedWith: [{ type: Schema.ObjectId, ref: 'User'}],
  hiddenOnOverviewBy: [{ type: Schema.ObjectId, ref: 'User'}],
  order: { type: Boolean, default: false },
  stock: [{
    item: { type: Schema.ObjectId, ref: 'Item'},
    amount: { type: Number, default: 0 },
    hq: { type: Boolean, default: false }
  }],
  public: { type: Boolean, default: false },
  private: { type: Boolean, default: true },
  comment: { type: String, default: '' },
  notes: { type: String, default: ''},
  tags: {type: String, default: ''}
})

mongoose.model('CraftingProject', CraftingProjectSchema)
