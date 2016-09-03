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
      .exec(function(err,result) {
        if(err) throw err;

        res.send(result);
      });
    },
    publicList: function(req,res) {
      CraftingProject.find({public:true})
      .exec(function(err,result) {
        if(err) throw err;

        res.send(result);
      });
    },
    addToStock: function(req,res) {
      CraftingProject.findById(req.params.projectId,function(err,project) {
        if(err) throw err;
        var found=false;

        project.stock.forEach(function(stock) {
          if(stock.item._id==req.params.itemId) {
            found=true;
            stock.amount+=parseInt(req.params.amount);

            if(stock.amount<=0) {
              project.stock.pull(stock);
              return;
            }
          }
        });

        if(!found) {
          project.stock.push({item:req.params.itemId,amount:req.params.amount});
        }

        project.save(function(err) {
          if(err) throw err;

          res.send({});
        })
      });
    },
    update: function(req,res){
      CraftingProject.findByIdAndUpdate(req.params.id,req.body,function(err,project) {
        if(err) throw err;

        res.send(project);
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
