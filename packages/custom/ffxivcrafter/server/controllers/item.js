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
      item.name='No Name';

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
    },
    importList:function(req,res) {
      var importData=req.body.importText.split(/\r|\n/);
      var filteredData = importData.filter(function(elem,pos) {
        return importData.indexOf(elem) == pos;
      });

      var newCounter=0;
      var savedCounter=0;

      filteredData.forEach(function(name) {
        Item.findOne({name:name},function(err,item) {
          if(err) throw err;

          if(!item) {
            console.log("trying to create "+name)
            newCounter++;

            item=new Item();
            item.name=name;
            item.save(function(err) {
              if(err) throw err;

              savedCounter++;
            });
          }
        });
      });

      res.send({
        newItems:newCounter,
        savedItems:savedCounter
      });
    }
  }
}
