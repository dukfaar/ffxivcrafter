'use strict'

angular.module('mean.ffxivCrafter').directive('notificationSettings', function () {
  return {
    templateUrl: '/ffxivCrafter/views/settings/notifications.html',
    controller: NotificationSettingsController
  }
})

NotificationSettingsController.$inject = ['$scope', 'Global', 'NotificationSettingsService', 'UserService']

function NotificationSettingsController ($scope, Global, NotificationSettingsService, UserService) {
  $scope.NotificationSettingsService = NotificationSettingsService
  $scope.UserService = UserService
}
