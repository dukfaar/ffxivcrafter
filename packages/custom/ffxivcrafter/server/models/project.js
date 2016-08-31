'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var CraftingProjectSchema = new Schema({
  tree: { type: Schema.ObjectId, ref: 'ProjectStep' },
  creator: { type: Schema.ObjectId, ref: 'User'}
});

var autoPopulate = function(next) {
  this.populate('creator');
  this.populate('tree');
  next();
};

CraftingProjectSchema
.pre('find',autoPopulate)
.pre('findOne',autoPopulate);

mongoose.model('CraftingProject',CraftingProjectSchema);
