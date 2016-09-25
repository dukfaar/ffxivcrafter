'use strict';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String,  unique: true },
  price: { type: Number, default: 0 },
  priceHQ: { type: Number, default: 0 },
  lastPriceUpdate: { type: Date, default: '1/1/1980' },
  gatheringEffort: { type: Number, default: 0},
  gatheringJob: { type:String, enum: ['None', 'Botanist', 'Miner'], default: 'None' },
  gatheringLevel: { type: Number, default: 0 },
  canBeOrderedByUnprivileged: { type: Boolean, default: false },
  soldOnMarket: { type: Boolean, default: false },
  inStock: { type: Number, default: 0},
  discount: { type: Number, default: 0}
});

mongoose.model('Item',ItemSchema);
