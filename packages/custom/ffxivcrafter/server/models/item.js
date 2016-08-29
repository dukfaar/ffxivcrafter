'use struct';

var mongoose=require('mongoose');

var Schema=mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String,  unique: true },
  price: { type: Number, default: 0 },
  priceHQ: { type: Number, default: 0 },
  gatheringEffort: { type: Number, default: 0},
  gatheringJob: { type:String, enum: ['None', 'Botanist', 'Miner'], default: 'None' },
  gatheringLevel: { type: Number, default: 0 }
});

mongoose.model('Item',ItemSchema);
