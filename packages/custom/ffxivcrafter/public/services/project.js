'use strict';

angular.module('mean.ffxivCrafter').factory('projectAnalyzerService', function() {
  function getAmountOfItemInUnnallocatedStock(projectData,itemId) {
    for(var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i];

      if(sItem.item._id==itemId) {
        return sItem.amount;
      }
    }

    return null;
  }

  function itemInUnallocatedStock(projectData,itemId,amount) {
    var storedAmount=getAmountOfItemInUnnallocatedStock(projectData,itemId,amount);

    return storedAmount!=null&&storedAmount>=amount;
  }

  function deductFromUnallocatedStock(projectData,itemId,amount) {
    for(var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i];

      if(sItem.item._id==itemId) {
        sItem.amount-=amount;
      }
    }
  }

  function gatheringStep(step,projectData) {
    var needsGathering=!itemInUnallocatedStock(projectData,step.item._id,step.amount);

    if(needsGathering) {
      if(!projectData.gatherList[step.item._id]) {
        projectData.gatherList[step.item._id] = {
          item: step.item,
          outstanding: 0
        };
      }

      var toGather=step.amount;

      var storedAmount=getAmountOfItemInUnnallocatedStock(projectData,step.item._id);
      if(storedAmount!=null) {
        toGather-=storedAmount;
        deductFromUnallocatedStock(projectData,step.item._id,storedAmount);
      }

      projectData.gatherList[step.item._id].outstanding+=toGather;
    } else {
      deductFromUnallocatedStock(projectData,step.item._id,step.amount);
    }
  }

  function buyingStep(step,projectData) {
    var needsGathering=!itemInUnallocatedStock(projectData,step.item,step.amount);

    if(needsGathering) {
      if(!projectData.gatherList[step.item._id]) {
        projectData.gatherList[step.item._id] = {
          item: step.item,
          outstanding: 0
        };
      }

      var toGather=step.amount;

      var storedAmount=getAmountOfItemInUnnallocatedStock(projectData,step.item);
      if(storedAmount!=null) {
        toGather-=storedAmount;
        deductFromUnallocatedStock(projectData,step.item,storedAmount);
      }

      projectData.gatherList[step.item._id].outstanding+=toGather;
      projectData.totalCost+=step.item.price*step.amount;
    } else {
      deductFromUnallocatedStock(projectData,step.item,step.amount);
    }
  }

  function craftingStep(step,projectData) {
    var neededAmount=step.amount-getAmountOfItemInUnnallocatedStock(projectData,step.item._id);

    if(neededAmount>0) {
      var neededSteps=Math.ceil(neededAmount/step.recipe.outputs[0].amount); //how often we need to craft the recipe the fulfill the need
      var maxSteps=neededSteps; //who often we can craft the recipe, with our input materials

      var isCraftable=true;

      var neededInputs={};

      step.recipe.inputs.forEach(function(input,index) {
        var neededItems=input.amount*neededSteps;

        var itemsInStock=getAmountOfItemInUnnallocatedStock(projectData,input.item);
        var remainingNeeded=neededItems-itemsInStock;
        neededInputs[index]=remainingNeeded;
        var possibleSteps=itemsInStock>0?itemsInStock/input.amount:0;

        console.log("I could craft %i times and still need %i",possibleSteps,remainingNeeded);
      });

      /*step.inputs.forEach(function(input) {
        var found=false;

        for(var stockItem in projectData.project.stock) {
          var sItem = projectData.project.stock[stockItem];

          if(sItem.item._id==input.item._id) {
            found=true;

            var maxItemSteps=sItem/input.amount

            if(sItem.amount<input.amount) {
              isCraftable=false;
            }

            break;
          }
        }

        if(!found) maxSteps=0;
      });*/

      /*if(isCraftable) {
        projectData.craftableSteps.push({
          step: step
        });
      } else {
        step.inputs.forEach(function(input) {
          analyzeStep(input,projectData);
        });
      }*/
    } else {
      deductFromUnallocatedStock(projectData,step.item._id,step.amount);
    }
  }

  function analyzeStep(step,projectData) {
    if(step.step==='Gather') {
      gatheringStep(step,projectData);
    } else if(step.step==='Craft') {
      craftingStep(step,projectData);
    } else if(step.step==='Buy') {
      buyingStep(step,projectData);
    }
  }

  function updateToGatherList(projectData) {
    for(var index in projectData.gatherList) {
      if(!projectData.gatherList.hasOwnProperty(index)) continue;
      projectData.gatherList[index].outstanding=projectData.gatherList[index].total;
    }

    for(var stockItem in projectData.project.stock) {
      if(projectData.gatherList[projectData.project.stock[stockItem].item._id]) {
        projectData.gatherList[projectData.project.stock[stockItem].item._id].outstanding -= projectData.project.stock[stockItem].amount;
      }
    }
  }

  function updateMaterialList(projectList,projectData) {
    projectList.forEach(function(project) {
      if(!projectData[project._id]) {
        projectData[project._id]={
          project: project,
          gatherList:{},
          craftableSteps:[],
          unallocatedStock:$.extend(true,{},project.stock),
          totalCost:0
        };
      }

      analyzeStep(project.tree,projectData[project._id]);
    });
  };

  return {
    analyzeStep:analyzeStep,
    updateToGatherList:updateToGatherList,
    updateMaterialList:updateMaterialList
  };
});
