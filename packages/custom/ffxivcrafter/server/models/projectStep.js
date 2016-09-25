'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ProjectStepSchema = new Schema({
  item: { type: Schema.ObjectId, ref: 'Item' },
  amount: Number,
  hq: { type: Boolean, default: false },
  step: { type: String, enum: ['Craft', 'Buy', 'Gather', 'Meta'] },
  recipe: { type: Schema.ObjectId, ref: 'Recipe' },
  inputs: [ { type: Schema.ObjectId, ref: 'ProjectStep' } ]
})

function autoPopulate (next) {
  this.populate('inputs')
  this.populate('item')
  this.populate('recipe')
  next()
}

ProjectStepSchema
  .pre('find', autoPopulate)
  .pre('findOne', autoPopulate)

mongoose.model('ProjectStep', ProjectStepSchema)
