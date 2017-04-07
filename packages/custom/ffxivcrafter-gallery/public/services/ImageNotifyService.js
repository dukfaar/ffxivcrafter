'use strict'

angular.module('mean.ffxivCrafter_gallery').factory('ImageNotifyService', ImageNotifyService)

ImageNotifyService.$inject = ['socket', '$q', 'webNotification',
  'NotificationSettingsService', '$translate', 'User']

function ImageNotifyService (socket, $q, webNotification,
      NotificationSettingsService, $translate, User) {
  socket.on('image created', function (data) {
    if (NotificationSettingsService.enabled.image) {
      $q.all({
        uploader: User.get({id: data.uploader}).$promise
      }).then(function (result) {
        $q.all([
          $translate('notification.image.title'),
          $translate('notification.image.text', {uploader: result.uploader})
        ])
        .then((texts) => {
          webNotification.showNotification(texts[0], {
            body: texts[1],
            icon: '/api/imageThumbnailData/' + data._id,
            autoClose: 10000
          })
        })
      })
    }
  })

  return {
  }
}
