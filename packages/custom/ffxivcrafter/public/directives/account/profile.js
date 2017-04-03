'use strict'

angular.module('mean.ffxivCrafter')
.directive('accountProfile', AccountProfileDirective)

function AccountProfileDirective () {
  return {
    controller: AccountProfileController,
    controllerAs: 'accountProfileController',
    templateUrl: '/ffxivCrafter/views/account/accountProfile.html',
    bindToController: {
      userId: '='
    },
    scope: true
  }
}

AccountProfileController.$inject = ['$scope', 'UserService', 'User', '$timeout', 'ForumPost', 'ImageComment', 'Image']

function AccountProfileController ($scope, UserService, User, $timeout, ForumPost, ImageComment, Image) {
  let vm = this
  this.UserService = UserService
  this.profileUser = {}
  this.forumPostCount = null
  this.galleryCommentCount = null
  this.latestForumPosts = []
  this.latestImages = []

  $timeout(initialize, 0)

  function initialize () {
    User.get({id: vm.userId, select: 'username name avatarImage aboutme'}).$promise.then((result) => {
      vm.profileUser = result
    })

    ForumPost.count({creator: vm.userId}).$promise.then((result) => {
      vm.forumPostCount = result.count
    })

    ImageComment.count({commentor: vm.userId}).$promise.then((result) => {
      vm.galleryCommentCount = result.count
    })

    ForumPost.query({creator: vm.userId, order: '-created', limit: 5}).$promise.then((result) => {
      vm.latestForumPosts = result
    })

    Image.query({uploader: vm.userId, order: '-uploadDate', limit: 6}).$promise.then((result) => {
      vm.latestImages = result
    })
  }
}
