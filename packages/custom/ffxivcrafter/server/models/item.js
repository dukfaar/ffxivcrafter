'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var ItemSchema = new Schema({
  name: { type:String },
  price: { type:Number, default: 0 }
});

mongoose.model('Item',ItemSchema);
