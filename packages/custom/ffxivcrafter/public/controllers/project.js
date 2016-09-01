'use strict';

angular.module('mean.system').controller('ProjectController', ['$scope', 'Global','$http', '$mdDialog',
  function($scope, Global,$http, $mdDialog) {
    $scope.projectList=[];
    $scope.projectData={};

    function analyzeStep(step,projectData) {
      if(step.step=="Gather") {

        if(!projectData.gatherList[step.item._id]) {
          projectData.gatherList[step.item._id] = {
            item: step.item,
            total: 0,
            outstanding: 0
          };
        }

        projectData.gatherList[step.item._id].total+=step.amount;
      }

      step.inputs.forEach(function(input) {
        analyzeStep(input,projectData);
      });
    }

    function updateToGatherList(projectData) {
      console.log(projectData);

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

    $scope.isGatherOutsanding=function(gather) {
      return gather.outstanding>0;
    }

    $scope.addToStock=function(project,item,amount) {
      $http.post('/api/project/stock/add/'+project._id+'/'+item._id+'/'+amount)
      .then(function(err,result) {
        $scope.updateList();
      });
    };

    $scope.updateMaterialList=function() {
      $scope.projectData={};

      $scope.projectList.forEach(function(project) {
        if(!$scope.projectData[project._id]) {
          $scope.projectData[project._id]={
            project: project,
            gatherList:{}
          };
        }
        analyzeStep(project.tree,$scope.projectData[project._id]);

        updateToGatherList($scope.projectData[project._id]);
      });
    };

    $scope.updateList=function() {
      var url='/api/project';

      $http.get(url)
      .then(function(response) {
        $scope.projectList=response.data;

        $scope.updateMaterialList();
      });
    };

    $scope.createProject=function() {
      $http.post('/api/project')
      .then(function(response) {
        $scope.updateList();
      });
    };

    $scope.updateList();
  }
]);
