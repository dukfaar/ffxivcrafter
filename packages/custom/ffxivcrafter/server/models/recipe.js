'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var RecipeSchema = new Schema({
  inputs: [{
    item: {type: Schema.ObjectId, ref: 'Item' },
    amount: {type: Number, default: 1 }
  }],
  outputs: [{
    item: {type: Schema.ObjectId, ref: 'Item' },
    amount: {type: Number, default: 1 }
  }],
  craftingJob: { type: String, enum: ['Armorer', 'Alchemist', 'Blacksmith', 'Carpenter', 'Weaver', 'Leatherworker', 'Goldsmith', 'Culinarian'], default: 'Armorer'},
  craftingLevel: { type: Number, min: 1, max: 60, default: 1},
  stars: { type: Number, default: 0 },
  requiredControl: { type: Number, default: 0 },
  requiredCraftsmanship: { type: Number, default: 0 },
  masterbook: { type: Number }
})

mongoose.model('Recipe', RecipeSchema)
