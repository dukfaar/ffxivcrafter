'use strict';

var mongoose=require('mongoose');
var Item = mongoose.model('Item');

module.exports = function() {
  return {
    list: function(req,res) {
      Item.find({},function(err,result) {
        if(err) throw err;

        res.send(result);
      });
    },
    filteredList: function(req,res) {
      Item.find({'name':{$regex:req.params.q,$options:'i'}},function(err,result) {
        if(err) throw err;

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
      Item.findById(req.params.id,function(err,item) {
        if(err) throw err;

        res.send(item);
      });
    },
    update: function(req,res){
      Item.findByIdAndUpdate(req.params.id,req.body,function(err,item) {
        if(err) throw err;

        res.send(item);
      });
    },
    delete: function(req,res){
      Item.findByIdAndRemove(req.params.id,function(err) {
        if(err) throw err;

        res.send({});
      });
    }
  }
}
