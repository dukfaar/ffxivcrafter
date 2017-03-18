'use strict'

angular.module('mean.ffxivCrafter').directive('reportingInvolvedItems', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/involvedItems.html',
    scope: {
    },
    controller: ReportingInvolvedItemsController
  }
})

ReportingInvolvedItemsController.$inject = ['$scope', '$rootScope', '_', 'Item', 'UserService']

function ReportingInvolvedItemsController ($scope, $rootScope, _, Item, UserService) {
  $scope.UserService = UserService

  $scope.data = {
    itemList: [],
    mappedLog: []
  }

  $scope.updateItem = function (item) {
    Item.update({id: item._id}, item)
  }

  $scope.updateList = function (log) {
    $scope.data.mappedLog = _.map(log, function (logItem) { return { item: _.extend({}, logItem.item), recipe: _.extend({}, logItem.recipe) } })
    $scope.data.itemList = _.uniqBy($scope.data.mappedLog, function (logEntry) { return logEntry.item._id })
  }

  $scope.$on('stockchangelog was refiltered', function (event, data) { $scope.updateList(data) })
}
