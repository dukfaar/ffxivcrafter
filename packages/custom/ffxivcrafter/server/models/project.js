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

var autoPopulate = function(next) {
  this.populate('creator');
  this.populate('tree');
  this.populate('stock.item');
  next();
};

CraftingProjectSchema
.pre('find',autoPopulate)
.pre('findOne',autoPopulate);

mongoose.model('CraftingProject',CraftingProjectSchema);
