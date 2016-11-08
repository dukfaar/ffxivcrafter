'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectSettingsController', ['$scope', 'localStorageService',
  function ($scope, localStorageService) {
    if (localStorageService.get('useProjectOverview') === null) localStorageService.set('useProjectOverview', false)
    if (!localStorageService.get('customProjectReportingCharts')) localStorageService.set('customProjectReportingCharts', [])
    if(!localStorageService.get('customCraftingReportingCharts')) localStorageService.set('customCraftingReportingCharts', [])

    $scope.data = {
      useOverview: localStorageService.get('useProjectOverview'),
      projectReportingDirectives: localStorageService.get('customProjectReportingCharts'),
      craftingReportingDirectives: localStorageService.get('customCraftingReportingCharts')
    }

    $scope.toggleUseProjectOverview = function () {
      localStorageService.set('useProjectOverview', $scope.data.useOverview)
    }

    $scope.saveProjectReportingDirectives = function () {
      localStorageService.set('customProjectReportingCharts', $scope.data.projectReportingDirectives)
    }

    $scope.saveCraftingReportingDirectives = function () {
      localStorageService.set('customCraftingReportingCharts', $scope.data.craftingReportingDirectives)
    }
  }
])
