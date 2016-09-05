'use strict';

var mongoose=require('mongoose');
var Recipe = mongoose.model('Recipe');
var Item = mongoose.model('Item');

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
      Recipe.find({'outputs.item':req.params.id})
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
    },
    xivdbImport:function(req,res) {
      var xivItemId=req.params.id;
      var url='http://api.xivdb.com/recipe/'+xivItemId;


      res.send({});
    }
  }
}
