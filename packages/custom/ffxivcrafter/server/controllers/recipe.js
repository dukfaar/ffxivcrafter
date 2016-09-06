'use strict';

var mongoose=require('mongoose');
var Recipe = mongoose.model('Recipe');
var Item = mongoose.model('Item');

var httpreq=require('httpreq');

module.exports = function() {
  var populateAndSend=function(findResult,res,req) {
    findResult
    .populate({
      path:'outputs.item',
      select: 'name'
    })
    .populate({
      path:'inputs.item',
      select: 'name'
    })
    .exec(function(err,result) {
      if(err) throw err;

      res.send(result);
    });
  };

  return {
    list: function(req,res) {
      populateAndSend(Recipe.find({}),res,req);
    },
    filteredList: function(req,res) {
      Item.find({'name':{$regex:req.params.q,$options:'i'}},function(err,result) {
        if(err) throw err;

        populateAndSend(Recipe.find({'outputs.item':{ $in: result } }),res,req);
      });
    },
    create: function(req,res) {
      var recipe=new Recipe();

      recipe.save(function(err) {
        if(err) res.send(err);

        res.json({text:'Recipe created'});
      });
    },
    get: function(req,res) {
      Recipe.findById(req.params.id,function(err,recipe) {
        if(err) throw err;

        res.send(recipe);
      });
    },
    update: function(req,res) {
      Recipe.findByIdAndUpdate(req.params.id,req.body,function(err,recipe) {
        if(err) throw err;

        res.send(recipe);
      });
    },
    delete: function(req,res) {
      Recipe.findByIdAndRemove(req.params.id,function(err) {
        if(err) throw err;

        res.send({});
      });
    },
    findByOutput:function(req,res) {
      populateAndSend(Recipe.find({'outputs.item':req.params.id}),res,req);
    },
    xivdbImport:function(req,res) {
      var xivItemId=req.params.id;
      var url='http://api.xivdb.com/recipe/'+xivItemId;

      httpreq.get(url,function(err,xivdata) {
        if(err) {
          res.status(500).send('Request failed');
        } else {
          var data;

          try {
            data=JSON.parse(xivdata.body);
          } catch(err) {
            res.status(500).send('Failed to parse the xiv data');
            return;
          }

          var recipe=new Recipe();
          recipe.craftingJob=data.class_name;
          recipe.craftingLevel=data.level_view;

          function creationDone() {
            recipe.save(function(err) {
              if(err) throw err;

              res.status(200).send('Recipe created');
            });
          }

          var creationCounter=1+data.tree.length;
          function decreaseCounter() {
            creationCounter--;

            if(creationCounter===0) creationDone();
          }

          function findOrCreateItem(name,xivid,callback) {
            Item.findOne({name: name})
            .exec(function(err,item) {
              if(err) throw err;

              if(item==null) {
                item=new Item();
                item.name=name;

                httpreq.get('http://api.xivdb.com/item/'+xivid,function(err,xivItemData) {
                  if(err) throw err;

                  var itemData=JSON.parse(xivItemData.body);
                  if(itemData.gathering&&itemData.gathering.length>0) {
                    item.gatheringLevel=itemData.gathering[0].level_view;
                    if(itemData.gathering[0].type_name=="Mining") item.gatheringJob="Miner";
                    else if(itemData.gathering[0].type_name=="Logging") item.gatheringJob="Botanist";
                  }

                  item.save(function(err) {
                    if(err) throw err;

                    callback(item);
                  });
                });

              } else {
                callback(item);
              }
            });
          }

          findOrCreateItem(data.name_en,data.item.id,function(item) {
            recipe.outputs.push({item:item._id,amount:1});
            decreaseCounter();
          });

          data.tree.forEach(function(input) {
            findOrCreateItem(input.name,input.id,function(item) {
              recipe.inputs.push({item:item._id,amount:input.quantity});
              decreaseCounter();
            });
          });
        }
      });
    }
  }
}
