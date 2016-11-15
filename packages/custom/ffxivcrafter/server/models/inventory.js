'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var InventorySchema = new Schema({
  items: [{
      item: { type: Schema.ObjectId, ref: 'Item' },
      amount: { type: Number, default: 0 }
   }],
   user: {type: Schema.ObjectId, ref: 'User' }
})

mongoose.model('Inventory', InventorySchema)
