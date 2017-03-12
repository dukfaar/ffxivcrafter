'use strict'

angular.module('mean.ffxivCrafter_forum').directive('forumPost', function () {
  return {
    templateUrl: '/ffxivCrafter_forum/views/post.html',
    bindToController: {
      post: '='
    },
    controller: PostController,
    controllerAs: 'postController',
    scope: true
  }
})

PostController.$inject = []

function PostController () {
}
