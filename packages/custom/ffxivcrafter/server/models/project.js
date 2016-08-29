'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var CraftingProjectSchema = new Schema({
  tree: { type: Schema.ObjectId, ref: 'ProjectStep' },
  creator: { type: Schema.ObjectId, ref: 'User'}
});

mongoose.model('CraftingProject',CraftingProjectSchema);
