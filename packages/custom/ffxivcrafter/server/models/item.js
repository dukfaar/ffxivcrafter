'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var ItemSchema = new Schema({
  name: { type:String }
});

mongoose.model('Item',ItemSchema);
