'use strict'

angular.module('mean.ffxivCrafter').controller('MainAppController', ['$scope', '$mdSidenav',
  function ($scope, $mdSidenav, $q) {
    if (window.localStorage.getItem('navigation.mode') === null) window.localStorage.setItem('navigation.mode', 'top')

    $scope.navigation = {
      mode: window.localStorage.getItem('navigation.mode')
    }

    $scope.onSwipeRight = function () {
      if($scope.navigation.mode === 'side') $mdSidenav('mainSideNav').open()
    }

    $scope.onSwipeLeft = function () {
      if($scope.navigation.mode === 'side') $mdSidenav('mainSideNav').close()
    }
  }
])
