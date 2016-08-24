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
  }]
});

mongoose.model('Recipe',RecipeSchema);
