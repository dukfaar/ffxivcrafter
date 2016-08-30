'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var ProjectStepSchema = new Schema({
  item: { type: Schema.ObjectId, ref: 'Item' },
  amount: Number,
  step: { type: String, enum:['Craft', 'Buy', 'Gather'] },
  recipe: [ { type: Schema.ObjectId, ref: 'Recipe' } ],
  inputs: [ { type: Schema.ObjectId, ref: 'ProjectStep' } ]
});

mongoose.model('ProjectStep',ProjectStepSchema);
