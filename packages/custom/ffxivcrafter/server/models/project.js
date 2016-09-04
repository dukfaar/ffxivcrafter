'use strict';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var CraftingProjectSchema = new Schema({
  tree: { type: Schema.ObjectId, ref: 'ProjectStep' },
  creator: { type: Schema.ObjectId, ref: 'User'},
  stock: [{
    item: { type: Schema.ObjectId, ref: 'Item'},
    amount: { type: Number, default: 0 }
  }],
  public: { type: Boolean, default: false }
});

mongoose.model('CraftingProject',CraftingProjectSchema);
