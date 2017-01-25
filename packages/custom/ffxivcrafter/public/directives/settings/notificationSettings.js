'use strict'

angular.module('mean.ffxivCrafter').directive('notificationSettings', function () {
  return {
    templateUrl: '/ffxivCrafter/views/settings/notifications.html',
    controller: function ($scope, Global, NotificationSettingsService, MeanUser) {
      $scope.NotificationSettingsService = NotificationSettingsService
      $scope.user = MeanUser.user
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }
    }
  }
})
