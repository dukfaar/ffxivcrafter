'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var RecipeSchema = new Schema({
  inputs: [{
    item:{type: Schema.ObjectId, ref: 'Item' },
    amount:{type: Number, default:1 }
 }],
  outputs: [{
    item:{type: Schema.ObjectId, ref: 'Item' },
    amount:{type: Number, default:1 }
  }],
  craftingJob: { type: String, enum:['Armorer','Alchimist','Blacksmith','Carpenter','Weaver','Leatherworker','Goldsmith','Culinarian'], default: 'Armorer'},
  craftingLevel: { type: Number, min: 1, max: 60, default: 1}
});

mongoose.model('Recipe',RecipeSchema);
