'use strict';

var mongoose=require('mongoose');

var CraftingProject = mongoose.model('CraftingProject');
var ProjectStep = mongoose.model('ProjectStep');
var Recipe = mongoose.model('Recipe');
var Item = mongoose.model('Item');

module.exports = function() {
  return {
    list: function(req,res) {
      CraftingProject.find({})
      //.populate('creator tree')
      .exec(function(err,result) {
        if(err) throw err;

        /*function populateTree(tree,callback) {
          if(tree.inputs.length===0) {
            callback();
            return
          }

          ProjectStep.populate(tree,['item',{path:'inputs',model:'ProjectStep'}])
          .then(function(step) {

            var runningSubPopulates=step.inputs.length;
            step.inputs.forEach(function(subStep) {
              populateTree(subStep,function() {
                runningSubPopulates--;
                if(runningSubPopulates===0) callback();
              });
            });
          });
        }

        populateTree(result[0].tree,function() {
          res.send(result);
        });*/

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
      var stepForItem=function(itemId,amount,callback) {
        var step=new ProjectStep();
        step.item=itemId;
        step.amount=amount;
        step.inputs=[];

        Recipe
        .find({'outputs.item':itemId})
        .exec(function(err,recipes) {
          if(err) throw err;

          if(recipes.length===0) {
            step.step='Gather';
            step.save(function(err) {
              if(err) throw err;

              callback(step);
            });
          } else {
            step.step='Craft';
            var recipe=recipes[0];
            step.recipe=recipe._id;

            var countdown=recipe.inputs.length;

            recipe.inputs.forEach(function(input) {
              stepForItem(input.item,input.amount*amount,function(childStep) {
                step.inputs.push(childStep);

                countdown--;
                if(countdown===0) {
                  step.save(function(err) {
                    if(err) throw err;
                    callback(step);
                  });
                }
              });
            });
          }
        });
      };

      stepForItem(req.params.id,1,function(step) {
        var project=new CraftingProject();
        project.creator=req.user._id;
        project.tree=step._id;

        project.save(function(err) {
          if(err) throw err;
        });
      });

      res.send({status:'Working on it'});
    }
  }
}
