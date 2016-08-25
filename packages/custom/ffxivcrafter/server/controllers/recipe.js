'use strict';

var mongoose=require('mongoose');
var Recipe = mongoose.model('Recipe');

module.exports = function() {
  return {
    list: function(req,res) {
      Recipe.find({})
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
    }
  }
}
