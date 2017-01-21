'use strict'

angular.module('mean.ffxivCrafter').directive('notificationSettings', function () {
  return {
    templateUrl: '/ffxivCrafter/views/settings/notifications.html',
    controller: function ($scope, Global, NotificationSettingsService) {
      $scope.NotificationSettingsService = NotificationSettingsService
    }
  }
})
