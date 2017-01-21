'use strict'

angular.module('mean.ffxivCrafter').factory('NotificationSettingsService',
  ['webNotification', 'localStorageService',
    function (webNotification, localStorageService) {
      if (localStorageService.get('notification.submission.enable') === null) {
        localStorageService.set('notification.submission.enable', true)
      }
      if (localStorageService.get('notification.craftable.enable') === null) {
        localStorageService.set('notification.craftable.enable', true)
      }

      var config = {
        enabled: {
          submission: localStorageService.get('notification.submission.enable'),
          craftable: localStorageService.get('notification.craftable.enable')
        }
      }

      return {
        enabled: config.enabled,
        saveSubmission: function () {
          localStorageService.set('notification.submission.enable', config.enabled.submission)
        },
        saveCraftable: function () {
          localStorageService.set('notification.craftable.enable', config.enabled.craftable)
        }
      }
    }
  ]
)
