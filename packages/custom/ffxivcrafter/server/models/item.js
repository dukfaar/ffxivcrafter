'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ItemSchema = new Schema({
  name: { type: String, unique: true },
  price: { type: Number, default: 0 },
  priceHQ: { type: Number, default: 0 },
  lastPriceUpdate: { type: Date, default: '1/1/1980' },
  ageMultiplier: { type: Number, default: 1 },
  gatheringEffort: { type: Number, default: 0 },
  gatheringJob: { type: String, enum: ['None', 'Botanist', 'Miner', 'FC'], default: 'None' },
  unspoiledNode: { type: Boolean, default: false },
  unspoiledNodeTime: {
    time: { type: Number, default: 0 },
    duration: { type: Number, default: 60 },
    ampm: { type: String, enum: ['AM', 'PM', 'AM/PM'], default: 'AM/PM' },
    folkloreNeeded: { type: String, enum: ['', 'coerthas', 'dravania', 'abalathia'], default: '' }
  },
  gatheringLevel: { type: Number, default: 0 },
  canBeOrderedByUnprivileged: { type: Boolean, default: false },
  soldOnMarket: { type: Boolean, default: false },
  inStock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  datedObject: { type: Boolean, default: false },
  availableFromNpc: { type: Boolean, default: false }
})

mongoose.model('Item', ItemSchema)
