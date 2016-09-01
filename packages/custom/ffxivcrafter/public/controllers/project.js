'use strict';

angular.module('mean.system').controller('ProjectController', ['$scope', 'Global','$http', '$mdDialog', 'projectAnalyzerService',
  function($scope, Global,$http, $mdDialog, projectAnalyzerService) {
    $scope.projectList=[];
    $scope.projectData={};

    $scope.gatherFilter='';
    $scope.gatherTotalFilter='';
    $scope.craftableFilter='';
    $scope.stockFilter='';

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
            gatherList:{},
            craftableSteps:[]
          };
        }
        projectAnalyzerService.analyzeStep(project.tree,$scope.projectData[project._id]);

        projectAnalyzerService.updateToGatherList($scope.projectData[project._id]);
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
