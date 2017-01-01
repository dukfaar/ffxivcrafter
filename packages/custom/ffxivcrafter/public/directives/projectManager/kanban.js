'use strict'

angular.module('mean.ffxivCrafter').directive('projectManagerKanban', function () {
  return {
    templateUrl: '/ffxivCrafter/views/projectManager/kanban.html',
    controller: function ($scope, Global, $http, $timeout, $q, _, KanbanCard, KanbanColumn, socket, localStorageService) {
      $scope.columns = []

      if (localStorageService.get('editKanbanColumns') === null) localStorageService.set('editKanbanColumns', false)

      $scope.editKanbanColumns = localStorageService.get('editKanbanColumns')

      function fetchColumns() {
        $scope.columns = KanbanColumn.query({})
      }

      fetchColumns()

      $scope.addColumn = function () {
        var newColumn = new KanbanColumn({name: 'New Column', order: $scope.columns.length})
        newColumn.$save()
        fetchColumns()
      }

      socket.on('KanbanColumn created', function (data) {
        fetchColumns()
      })

      socket.on('KanbanColumn deleted', function (data) {
        fetchColumns()
      })
    }
  }
})
