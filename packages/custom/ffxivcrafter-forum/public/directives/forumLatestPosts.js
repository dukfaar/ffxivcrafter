'use strict'

angular.module('mean.ffxivCrafter_forum').directive('forumLatestPosts', ForumLatestPosts)

function ForumLatestPosts () {
  return {
    templateUrl: '/ffxivCrafter_forum/views/latestPosts.html',
    scope: {
    },
    controllerAs: 'latestPostsController',
    controller: LatestPostsController
  }
}

function LatestPostsController ($scope, socket, ForumThread, ForumPost) {
  let vm = this

  vm.posts = []

  function queryPosts () {
    ForumPost.query({sort: 'created', limit: 5, populate: 'thread'})
    .$promise.then(function (data) {
      vm.posts = data
    })
  }

  function postChangeListener (newPost) {
    queryPosts()
  }

  socket.auto('ForumPost created', postChangeListener, $scope)
  socket.auto('ForumPost updated', postChangeListener, $scope)
  socket.auto('ForumPost deleted', postChangeListener, $scope)

  queryPosts()
}
