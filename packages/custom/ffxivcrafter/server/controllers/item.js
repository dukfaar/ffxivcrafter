'use strict';

var mongoose=require('mongoose');
var Item = mongoose.model('Item');

module.exports = function() {
  return {
    list: function(req,res) {
      Item.find({},function(err,result) {
        res.send(result);
      });
    },
    create: function(req,res){
      var item=new Item();
      item.name='Sinnloser Name';

      item.save(function(err) {
        if(err) res.send(err);

        res.json({text:'Item created'});
      });
    },
    get: function(req,res){

    },
    update: function(req,res){

    },
    delete: function(req,res){

    }
  }
}
