'use strict'

angular.module('mean.ffxivCrafter_forum').factory('ForumPostNotifyService',
  ['socket', '$q', 'webNotification',
  'NotificationSettingsService', 'ForumPost', 'MeanUser',
    function (socket, $q, webNotification,
    NotificationSettingsService, ForumPost, MeanUser) {
      function allowed (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }

      socket.on('ForumPost created', function (data) {
        if (NotificationSettingsService.enabled.forumpost && allowed('see forum')) {
          ForumPost.get({id: data._id, populate: 'creator thread'})
          .$promise.then(function (post) {
            webNotification.showNotification('New Forum Post!', {
              body: 'Thread: ' + post.thread.title + '\nby ' + post.creator.name,
              autoClose: 10000
            })
          })
        }
      })

      return {
      }
    }
  ]
)
