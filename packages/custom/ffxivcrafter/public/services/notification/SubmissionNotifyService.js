'use strict'

angular.module('mean.ffxivCrafter').factory('SubmissionNotifyService',
  ['socket', 'ProjectDatabase', 'ItemDatabase', '$q', 'webNotification',
    'NotificationSettingsService', '$translate',
    function (socket, ProjectDatabase, ItemDatabase, $q, webNotification,
    NotificationSettingsService, $translate) {
      function sendNotification (texts) {
        webNotification.showNotification(texts[0], {
          body: texts[1],
          autoClose: 10000
        })
      }

      socket.on('project stock changed', function (data) {
        if (data.amount > 0 && NotificationSettingsService.enabled.submission) {
          $q.all({
            item: ItemDatabase.get(data.item).$promise,
            project: ProjectDatabase.get(data.projectId).$promise
          }).then(function (result) {
            if (result.project && result.project._id) {
              $q.all([
                $translate('notification.submission.title'),
                $translate('notification.submission.text', {amount: data.amount, item: result.item, user: data.user, project: result.project})
              ])
              .then(sendNotification)
            }
          })
        }
      })

      return {
      }
    }
  ]
)
