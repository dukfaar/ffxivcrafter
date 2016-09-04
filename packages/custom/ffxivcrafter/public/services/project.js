'use strict';

angular.module('mean.system').factory('projectAnalyzerService', function() {
  function getAmountOfItemInUnnallocatedStock(projectData,item) {
    for(var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i];

      if(sItem.item._id==item._id) {
        return sItem.amount;
      }
    }

    return null;
  }

  function itemInUnallocatedStock(projectData,item,amount) {
    var storedAmount=getAmountOfItemInUnnallocatedStock(projectData,item,amount);

    return storedAmount!=null&&storedAmount>=amount;
  }

  function deductFromUnallocatedStock(projectData,item,amount) {
    for(var i in projectData.unallocatedStock) {
      var sItem = projectData.unallocatedStock[i];

      if(sItem.item._id==item._id) {
        sItem.amount-=amount;
      }
    }
  }

  function gatheringStep(step,projectData) {
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
    } else {
      deductFromUnallocatedStock(projectData,step.item,step.amount);
    }
  }

  function craftingStep(step,projectData) {
    var needsCrafting=!itemInUnallocatedStock(projectData,step.item,step.amount);

    if(needsCrafting) {
      var isCraftable=true;

      step.inputs.forEach(function(input) {
        var found=false;

        for(var stockItem in projectData.project.stock) {
          var sItem = projectData.project.stock[stockItem];

          if(sItem.item._id==input.item._id) {
            found=true;

            if(sItem.amount<input.amount) {
              isCraftable=false;
            }
          }
        }

        if(!found) isCraftable=false;
      });

      if(isCraftable) {
        projectData.craftableSteps.push({
          step: step
        });
      } else {
        step.inputs.forEach(function(input) {
          analyzeStep(input,projectData);
        });
      }
    } else {
      deductFromUnallocatedStock(projectData,step.item,step.amount);
    }
  }

  function analyzeStep(step,projectData) {
    if(step.step==='Gather') {
      gatheringStep(step,projectData);
    } else if(step.step==='Craft') {
      craftingStep(step,projectData);
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
          unallocatedStock:$.extend(true,{},project.stock)
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
