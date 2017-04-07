'use strict'

angular.module('mean.ffxivCrafter_gallery').factory('ImageCommentNotifyService', ImageCommentNotifyService)

ImageCommentNotifyService.$inject = ['socket', '$q', 'webNotification',
  'NotificationSettingsService', '$translate', 'Image', 'User']

function ImageCommentNotifyService (socket, $q, webNotification,
      NotificationSettingsService, $translate, Image, User) {
  socket.on('ImageComment created', function (data) {
    if (NotificationSettingsService.enabled.imagecomment) {
      $q.all({
        commentor: User.get({id: data.commentor}).$promise
      }).then(function (result) {
        $q.all([
          $translate('notification.imagecomment.title'),
          $translate('notification.imagecomment.text', {commentor: result.commentor, comment: data})
        ])
        .then((texts) => {
          webNotification.showNotification(texts[0], {
            body: texts[1],
            icon: '/api/imageThumbnailData/' + data.image,
            autoClose: 10000
          })
        })
      })
    }
  })

  return {
  }
}
