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

AccountProfileController.$inject = ['$scope', 'UserService', 'User', '$timeout',
  'ForumPost', 'ImageComment', 'Image', '$mdMedia',
  'UserCombatClasses', 'UserBirthday', 'UserDataService', 'UserRank', 'RankDatabase']

function AccountProfileController ($scope, UserService, User, $timeout,
  ForumPost, ImageComment, Image, $mdMedia,
  UserCombatClasses, UserBirthday, UserDataService, UserRank, RankDatabase) {
  let vm = this
  this.UserService = UserService
  this.RankDatabase = RankDatabase
  this.profileUser = {}
  this.forumPostCount = null
  this.galleryCommentCount = null
  this.galleryImageCount = null
  this.latestForumPosts = []
  this.latestImages = []
  this.latestImageComments = []
  this.$mdMedia = $mdMedia
  this.userCombatClasses = {}
  this.birthday = null
  this.rank = null

  $timeout(initialize, 0)

  function initialize () {
    User.get({
      id: vm.userId,
      select: 'username name avatarImage aboutme minerLevel botanistLevel goldsmithLevel leatherworkerLevel weaverLevel culinarianLevel alchimistLevel blacksmithLevel carpenterLevel armorerLevel'
    }).$promise.then((result) => {
      vm.profileUser = result
    })

    ForumPost.count({creator: vm.userId}).$promise.then((result) => {
      vm.forumPostCount = result.count
    })

    ImageComment.count({commentor: vm.userId}).$promise.then((result) => {
      vm.galleryCommentCount = result.count
    })

    Image.count({uploader: vm.userId}).$promise.then((result) => {
      vm.galleryImageCount = result.count
    })

    ForumPost.query({creator: vm.userId, sort: '-created', limit: 5}).$promise.then((result) => {
      vm.latestForumPosts = result
    })

    Image.query({uploader: vm.userId, sort: '-uploadDate', limit: 6}).$promise.then((result) => {
      vm.latestImages = result
    })

    ImageComment.query({commentor: vm.userId, sort: '-date', limit: 5}).$promise.then((result) => {
      vm.latestImageComments = result
    })

    UserDataService.fetchOrCreateUserDataForUserId(UserCombatClasses, vm.userId)
    .then(userCombatClasses => {
        vm.userCombatClasses = userCombatClasses
    })

    UserDataService.fetchOrCreateUserDataForUserId(UserBirthday, vm.userId)
    .then(birthday => {
        vm.birthday = birthday
    })

    UserDataService.fetchOrCreateUserDataForUserId(UserRank, vm.userId)
    .then(userRank => {
      vm.rank = RankDatabase.get(userRank.rank)
    })
  }
}
