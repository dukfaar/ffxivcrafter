'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectSettingsController', ['$scope', 'localStorageService',
  function ($scope, localStorageService) {
    if(localStorageService.get('useProjectOverview') == null) localStorageService.set('useProjectOverview', false)

    $scope.data = {
      useOverview: localStorageService.get('useProjectOverview')
    }

    $scope.toggleUseProjectOverview = function() {
      localStorageService.set('useProjectOverview', $scope.data.useOverview)
    }
  }
])
