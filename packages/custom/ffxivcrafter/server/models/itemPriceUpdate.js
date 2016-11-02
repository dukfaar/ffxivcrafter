'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ItemPriceUpdateSchema = new Schema({
  item: { type: Schema.ObjectId, ref: 'Item' },
  price: { type: Number, default: 0 },
  priceHQ: { type: Number, default: 0 },
  date: { type: Date, default: '1/1/1980' }
})

mongoose.model('ItemPriceUpdate', ItemPriceUpdateSchema)
