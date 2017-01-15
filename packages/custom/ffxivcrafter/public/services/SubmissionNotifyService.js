'use strict'

angular.module('mean.ffxivCrafter').factory('SubmissionNotifyService',
  ['socket', 'ProjectDatabase', 'ItemDatabase', '$q', 'webNotification',
    function (socket, ProjectDatabase, ItemDatabase, $q, webNotification) {
      socket.on('project stock changed', function (data) {
        if (data.amount > 0) {
          var project = ProjectDatabase.get(data.projectId)
          var item = ItemDatabase.get(data.item)

          $q.all([
            item.$promise,
            project.$promise
          ]).then(function (result) {
            if (project && project._id) {
              webNotification.showNotification('Project item submission!', {
                body: data.amount + ' ' + item.name + '\nProject: ' + project.name + '\nby ' + data.user.name,
                autoClose: 10000
              })
            }
          })
        }
      })

      return {
      }
    }
  ])
