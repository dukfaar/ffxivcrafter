'use strict';

var mongoose=require('mongoose');
var Item = mongoose.model('Item');

module.exports = function() {
  var doFind=function(query,req,res) {
    if(req.query.privileged&&req.query.privileged==='true') {
      query['canBeOrderedByUnprivileged']=true;
    }

    if(req.query.mbItems&&req.query.mbItems==='true') {
      query['soldOnMarket']=true;
    }

    var limit=parseInt(req.query.limit);
    var page=parseInt(req.query.page);

    Item.count(query,function(err, count) {
      var q = Item.find(query);

      if(limit&&limit>0) q=q.limit(limit);
      if(page&&page>-1) q=q.skip(page*limit);

      q.exec(function(err,data) {
        if(err) throw err;

        var result = {
          count: count,
          list: data
        };

        res.send(result);
      });
    });
  };

  return {
    list: function(req,res) {
      doFind({},req,res);
    },

    filteredList: function(req,res) {
      doFind({'name':{$regex:req.params.q,$options:'i'}},req,res);
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
