'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectSettingsController', ['$scope',
  function ($scope) {
    if(window.localStorage.getItem('useProjectOverview') == null) window.localStorage.setItem('useProjectOverview', false)

    $scope.data = {
      useOverview: JSON.parse(window.localStorage.getItem('useProjectOverview'))
    }

    $scope.setUseProjectOverview = function(value) {
      window.localStorage.setItem('useProjectOverview', value)
    }
  }
])
