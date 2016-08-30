'use strict';

var mongoose=require('mongoose');
var CraftingProject = mongoose.model('CraftingProject');
var ProjectStep = mongoose.model('ProjectStep');

module.exports = function() {
  return {
    list: function(req,res) {
      CraftingProject.find({})
      .exec(function(err,result) {
        if(err) throw err;

        res.send(result);
      });
    },
    create: function(req,res) {
      var project=new CraftingProject();
      project.creator=req.user._id;

      project.save(function(err) {
        if(err) res.send(err);

        res.json({text:'CraftingProject created'});
      });
    },
    get: function(req,res) {
      project.findById(req.params.id,function(err,CraftingProject) {
        if(err) throw err;

        res.send(CraftingProject);
      });
    },
    update: function(req,res) {
      project.findByIdAndUpdate(req.params.id,req.body,function(err,CraftingProject) {
        if(err) throw err;

        res.send(CraftingProject);
      });
    },
    delete: function(req,res) {
      project.findByIdAndRemove(req.params.id,function(err) {
        if(err) throw err;

        res.send({});
      });
    },
    fromItem: function(req,res) {
      var project=new CraftingProject();
      project.creator=req.user._id;

      project.save(function(err) {
        if(err) res.send(err);

        res.json({text:'CraftingProject created'});
      });
    }
  }
}
