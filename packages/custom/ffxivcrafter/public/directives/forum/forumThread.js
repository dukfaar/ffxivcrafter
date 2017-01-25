'use strict'

angular.module('mean.ffxivCrafter').directive('forumThread', function () {
  return {
    templateUrl: '/ffxivCrafter/views/forum/thread.html',
    scope: {
      threadId: '=threadId'
    },
    controller: function ($scope, Global, $q, _, socket, ForumThread, ForumPost, $mdDialog, MeanUser, $location) {
      $scope.user = MeanUser.user
      $scope.allowed = function (perm) {
        return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
      }

      function creationListener (newPost) {
        if (newPost.thread === $scope.threadId) {
          ForumPost.query({thread: $scope.threadId, populate: 'creator'})
          .$promise.then(function (data) {
            $scope.posts = data
          })
        }
      }

      socket.on('ForumPost created', creationListener)

      $scope.$on('$destroy', function () {
        socket.off('ForumPost created', creationListener)
      })

      $scope.thread = ForumThread.get({id: $scope.threadId, populate: 'creator'})
      $scope.posts = ForumPost.query({thread: $scope.threadId, populate: 'creator'})

      function DialogController ($scope, $mdDialog) {
        $scope.data = {
        }

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
          .textContent('Do you really want to delete this thread.')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function() {
          ForumThread.delete({id: $scope.threadId}).$promise
          .then(function () {
            $location.path('/forum/category/' + $scope.thread.category)
          })
        }, function() {

        })
      }

      $scope.deletePostDialog = function (post) {
        $mdDialog.show($mdDialog.confirm()
          .title('Delete post')
          .textContent('Do you really want to delete this post.')
          .ok('Please do it!')
          .cancel('Hell no!')
        ).then(function() {
          ForumPost.delete({id: post._id}).$promise
          .then(function () {
            $scope.posts = ForumPost.query({thread: $scope.threadId, populate: 'creator'})
          })
        }, function() {

        })
      }

      $scope.createPostDialog = function () {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter/views/forum/newPostDialog.html',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          controller: DialogController
        }).then(function (data) {
          var newPost = new ForumPost(data)
          newPost.thread = $scope.threadId
          newPost.creator = MeanUser.user
          newPost.$save().then(function () {
            $scope.thread.lastUpdate = new Date()
            ForumThread.update({id: $scope.thread._id}, $scope.thread)
          })
        }, function () {
        })
      }
    }
  }
})
