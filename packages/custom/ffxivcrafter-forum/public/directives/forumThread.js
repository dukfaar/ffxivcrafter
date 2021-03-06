'use strict'

angular.module('mean.ffxivCrafter_forum').directive('forumThread', function () {
  return {
    templateUrl: '/ffxivCrafter_forum/views/thread.html',
    scope: {
      threadId: '=threadId'
    },
    controller: function ($scope, Global, $q, _, socket, ForumThread, ForumPost, $mdDialog, MeanUser, $location, $stateParams) {
      $scope.user = MeanUser.user
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) !== -1
      }

      $scope.startPost = $stateParams.post

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

      socket.auto('ForumPost created', creationListener, $scope)
      socket.auto('ForumPost updated', creationListener, $scope)
      socket.auto('ForumPost deleted', deletionListener, $scope)

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
        ).then(function () {
          ForumThread.delete({id: $scope.threadId}).$promise
          .then(function () {
            $location.path('/forum/category/' + $scope.thread.category)
          })
        }, function () {
        })
      }

      $scope.deletePostDialog = function (post) {
        $mdDialog.show($mdDialog.confirm()
          .title('Delete post')
          .textContent('Do you really want to delete this post.')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function () {
          ForumPost.delete({id: post._id}).$promise
          .then(function () {
            $scope.posts = ForumPost.query({thread: $scope.threadId, populate: 'creator'})
          })
        }, function () {
        })
      }

      $scope.createPostDialog = function () {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newPostDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController,
          locals: {
            data: {text: 'Write Some Text!'},
            edit: false
          }
        }).then(function (data) {
          var newPost = new ForumPost(data)
          newPost.thread = $scope.threadId
          newPost.creator = MeanUser.user
          newPost.$save().then(function () {
            $scope.thread.lastUpdate = new Date()
            ForumThread.update({id: $scope.thread._id}, _.omit($scope.thread, 'creator'))
          })
        }, function () {
        })
      }

      $scope.editPostDialog = function (post) {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter_forum/views/newPostDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController,
          locals: {
            data: _.extend({ text: '' }, post),
            edit: true
          }
        }).then(function (data) {
          data.lastEdited = new Date()
          ForumPost.update({id: data._id}, _.omit(data, 'creator'))

          $scope.thread.lastUpdate = new Date()
          ForumThread.update({id: $scope.thread._id}, _.omit($scope.thread, 'creator'))
        }, function () {
        })
      }
    }
  }
})
