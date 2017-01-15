'use strict'

angular.module('mean.ffxivCrafter').controller('ProjectSettingsController', ['$scope', 'localStorageService',
  function ($scope, localStorageService) {
    if (localStorageService.get('useProjectOverview') === null) localStorageService.set('useProjectOverview', false)
    if (localStorageService.get('editKanbanColumns') === null) localStorageService.set('editKanbanColumns', false)
    if (localStorageService.get('unspoiledTimeline') == null) localStorageService.set('unspoiledTimeline', false)

    $scope.data = {
      useOverview: localStorageService.get('useProjectOverview'),
      editKanbanColumns: localStorageService.get('editKanbanColumns'),
      showUnspoiledTimelime: localStorageService.get('unspoiledTimeline')
    }

    $scope.toggleUseProjectOverview = function () {
      localStorageService.set('useProjectOverview', $scope.data.useOverview)
    }

    $scope.toggleEditKanbanColumns = function () {
      localStorageService.set('editKanbanColumns', $scope.data.editKanbanColumns)
    }

    $scope.toggleUnspoiledTimeline = function () {
      localStorageService.set('unspoiledTimeline', $scope.data.showUnspoiledTimelime)
    }
  }
])
