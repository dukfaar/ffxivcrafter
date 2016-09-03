'use strict';

angular.module('mean.system').factory('projectAnalyzerService', function() {
  function analyzeStep(step,projectData) {
    if(step.step==='Gather') {

      if(!projectData.gatherList[step.item._id]) {
        projectData.gatherList[step.item._id] = {
          item: step.item,
          total: 0,
          outstanding: 0
        };
      }

      projectData.gatherList[step.item._id].total+=step.amount;

      return;
    } else if(step.step==='Craft') {
      var isCraftable=true;

      for(var stockItem in projectData.project.stock) {
        var sItem = projectData.project.stock[stockItem];

        if(sItem.item._id==step.item._id) {
          if(sItem.amount>=step.amount) {
            isCraftable=false;
          }
        }
      }

      if(isCraftable) {
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
      }

      if(isCraftable) {
        projectData.craftableSteps.push({
          step: step
        });
      }
    }

    step.inputs.forEach(function(input) {
      analyzeStep(input,projectData);
    });
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
          craftableSteps:[]
        };
      }
      analyzeStep(project.tree,projectData[project._id]);

      updateToGatherList(projectData[project._id]);
    });
  };

  return {
    analyzeStep:analyzeStep,
    updateToGatherList:updateToGatherList,
    updateMaterialList:updateMaterialList
  };
});
