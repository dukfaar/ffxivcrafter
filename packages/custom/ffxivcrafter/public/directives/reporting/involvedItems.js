'use strict'

angular.module('mean.ffxivCrafter').directive('reportingInvolvedItems', function () {
  return {
    templateUrl: '/ffxivCrafter/views/reporting/involvedItems.html',
    scope: {
      log: '='
    },
    controller: function ($scope, _, Item, MeanUser) {
      $scope.user = MeanUser
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }

      $scope.data = {
        itemList: [],
        mappedLog: []
      }

      $scope.updateItem = function (item) {
        Item.update({id: item._id}, item)
      }

      $scope.updateList = function () {
        $scope.data.mappedLog = _.map($scope.log, function (logItem) { return { item: _.extend({}, logItem.item), recipe: _.extend({}, logItem.recipe) } })
        $scope.data.itemList = _.uniqBy($scope.data.mappedLog, function (logEntry) { return logEntry.item._id })
      }

      $scope.$watch('log', $scope.updateList, true)
    }
  }
})
