'use strict'

angular.module('mean.ffxivCrafter').controller('DoLDoHOverviewController', ['$scope', '$http',
  function ($scope, $http) {
    $scope.users=[]

    $scope.fields = [
      ['name','Name'],
      ['minerLevel','Miner'],
      ['botanistLevel','Botanist'],
      ['weaverLevel','Weaver'],
      ['culinarianLevel','Culinarian'],
      ['alchimistLevel','Alchemist'],
      ['blacksmithLevel','Blacksmith'],
      ['carpenterLevel','Carpenter'],
      ['armorerLevel','Armorer'],
      ['goldsmithLevel','Goldsmith'],
      ['leatherworkerLevel','Leatherworker']
    ]

    $scope.orderingField = 'name'
    $scope.orderingReverse = false

    $scope.updateList=function() {
      $http.get('/api/users')
      .then(function(response) {
        $scope.users=response.data
      })
    }

    $scope.orderBy=function(fieldName) {
      if($scope.orderingField===fieldName) {
        $scope.orderingReverse = !$scope.orderingReverse
      } else {
        $scope.orderingField = fieldName
      }
    }

    $scope.updateList()
  }
])
