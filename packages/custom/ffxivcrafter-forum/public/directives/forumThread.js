'use strict'

angular.module('mean.ffxivCrafter_forum').directive('forumThread', function () {
  return {
    templateUrl: '/ffxivCrafter_forum/views/thread.html',
    scope: {
      threadId: '=threadId'
    },
    controller: function ($scope, Global, $q, _, socket, ForumThread, ForumPost, $mdDialog, MeanUser, $location, Analytics) {
      $scope.user = MeanUser.user
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }

      function queryPosts () {
        ForumPost.query({thread: $scope.threadId, populate: 'creator'})
        .$promise.then(function (data) {
          $scope.posts = data
        })
      }

      function creationListener (newPost) {
        if (newPost.thread === $scope.threadId) {
          queryPosts()
        }
      }

      function deletionListener (deletedPost) {
        queryPosts()
      }

      socket.on('ForumPost created', creationListener)
      socket.on('ForumPost updated', creationListener)
      socket.on('ForumPost deleted', deletionListener)

      $scope.$on('$destroy', function () {
        socket.off('ForumPost created', creationListener)
        socket.off('ForumPost updated', creationListener)
        socket.off('ForumPost deleted', deletionListener)
      })

      $scope.thread = ForumThread.get({id: $scope.threadId, populate: 'creator'})
      $scope.posts = []

      queryPosts()

      function DialogController ($scope, $mdDialog, data, edit) {
        $scope.data = data
        $scope.edit = edit

        $scope.hide = function () {
          $mdDialog.hide()
        }
        $scope.cancel = function () {
          $mdDialog.cancel()
        }
        $scope.save = function () {
          $mdDialog.hide($scope.data)
        }
      }

      $scope.deleteThreadDialog = function () {
        $mdDialog.show($mdDialog.confirm()
          .title('Delete thread')
          .textContent('Do you really want to delete this thread?')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function() {
          Analytics.trackEvent(['forum thread', 'delete thread', 'deleted'])
          ForumThread.delete({id: $scope.threadId}).$promise
          .then(function () {
            $location.path('/forum/category/' + $scope.thread.category)
          })
        }, function() {
          Analytics.trackEvent(['forum thread', 'delete thread', 'canceled'])
        })
      }

      $scope.deletePostDialog = function (post) {
        $mdDialog.show($mdDialog.confirm()
          .title('Delete post')
          .textContent('Do you really want to delete this post.')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function() {
          Analytics.trackEvent(['forum message', 'delete message', 'deleted'])
          ForumPost.delete({id: post._id}).$promise
          .then(function () {
            $scope.posts = ForumPost.query({thread: $scope.threadId, populate: 'creator'})
          })
        }, function() {
          Analytics.trackEvent(['forum message', 'delete message', 'canceled'])
        })
      }

      $scope.createPostDialog = function () {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newPostDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController,
          locals: {
            data: {text: "Write Some Text!"},
            edit: false
          }
        }).then(function (data) {
          Analytics.trackEvent(['forum message', 'create message', 'created'])
          var newPost = new ForumPost(data)
          newPost.thread = $scope.threadId
          newPost.creator = MeanUser.user
          newPost.$save().then(function () {
            $scope.thread.lastUpdate = new Date()
            ForumThread.update({id: $scope.thread._id}, $scope.thread)
          })
        }, function () {
          Analytics.trackEvent(['forum message', 'create message', 'canceled'])
        })
      }

      $scope.editPostDialog = function (post) {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newPostDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController,
          locals: {
            data: _.extend({ text: "" }, post),
            edit: true
          }
        }).then(function (data) {
          Analytics.trackEvent(['forum message', 'edit message', 'edited'])
          data.lastEdited = new Date()
          ForumPost.update({id: data._id}, data)
          
          $scope.thread.lastUpdate = new Date()
          ForumThread.update({id: $scope.thread._id}, $scope.thread)
        }, function () {
          Analytics.trackEvent(['forum message', 'edit message', 'canceled'])
        })
      }
    }
  }
})
