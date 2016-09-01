'use strict';

var mongoose=require('mongoose');
var ProjectStep = mongoose.model('ProjectStep');

module.exports = function() {
  return {
    list: function(req,res) {
      ProjectStep.find({})
      .exec(function(err,result) {
        if(err) throw err;

        res.send(result);
      });
    },
    create: function(req,res) {
      var step=new ProjectStep();
      console.log(req);

      step.save(function(err) {
        if(err) res.send(err);

        res.json({text:'ProjectStep created'});
      });
    },
    get: function(req,res) {
      ProjectStep.findById(req.params.id,function(err,step) {
        if(err) throw err;

        res.send(step);
      });
    },
    update: function(req,res) {
      ProjectStep.findByIdAndUpdate(req.params.id,req.body,function(err,step) {
        if(err) throw err;

        res.send(step);
      });
    },
    delete: function(req,res) {
      ProjectStep.findByIdAndRemove(req.params.id,function(err) {
        if(err) throw err;

        res.send({});
      });
    }
  }
}
