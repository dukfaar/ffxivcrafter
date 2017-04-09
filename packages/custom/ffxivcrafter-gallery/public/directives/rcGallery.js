'use strict'

angular.module('mean.ffxivCrafter_gallery').directive('rcGallery', function () {
  return {
    controller: GalleryController,
    controllerAs: 'galleryController',
    templateUrl: '/ffxivCrafter_gallery/views/gallery.html'
  }
})

GalleryController.$inject = ['$scope', '$http', 'Analytics', 'FileUpload', '_', 'socket', '$mdDialog', 'Image', '$q', '$mdMedia']

function GalleryController ($scope, $http, Analytics, FileUpload, _, socket, $mdDialog, Image, $q, $mdMedia) {
  let vm = this
  this.Image = Image
  this.$mdMedia = $mdMedia

  this.filter = {
    tags: null,
    sort: '-uploadDate'
  }

  this.FileUpload = FileUpload.getUploader('/api/image')

  ImageDetailDialogController.$inject = ['$scope', 'image', '$http', '$mdDialog', 'UserDatabase', 'Image', 'ImageComment', 'UserService', 'socket']

  function ImageDetailDialogController ($scope, image, $http, $mdDialog, UserDatabase, Image, ImageComment, UserService, socket) {
    let detail_vm = this
    this.image = image
    this.UserDatabase = UserDatabase
    this.sendComment = sendComment
    this.commentInputText = ''

    this.comments = []
    getComments()

    socket.auto('ImageComment created', getComments, $scope)
    socket.auto('ImageComment updated', getComments, $scope)
    socket.auto('ImageComment deleted', getComments, $scope)

    function getComments () {
      ImageComment.query({image: image._id, select: 'commentor text date'}).$promise.then(result => { detail_vm.comments = result })
    }

    function sendComment () {
      if (detail_vm.commentInputText.length === 0) return

      let newComment = new ImageComment()
      newComment.image = detail_vm.image._id
      newComment.commentor = UserService.user._id
      newComment.date = new Date()
      newComment.text = detail_vm.commentInputText

      newComment.$save().then(() => {
        this.commentInputText = ''
      })
    }

    this.updateImage = (image) => { Image.update({id: image._id}, image) }

    this.canEdit = function (image) {
      return UserService.allowed('admin') || image.uploader === UserService.user._id
    }

    this.canDelete = function (image) {
      return UserService.allowed('admin') || image.uploader === UserService.user._id
    }

    this.deleteImage = function (image) {
      $mdDialog.show(
        $mdDialog.confirm()
        .title('Confirm deletion')
        .textContent('Do you really want to delete this image?')
        .ok('Yes, just do it')
        .cancel('No!')
      )
      .then(function () {
        Image.delete({id: image._id})
      })
    }
  }

  this.detailViewImage = function (image) {
    $mdDialog.show({
      templateUrl: 'ffxivCrafter_gallery/views/detail.html',
      parent: angular.element(document.body),
      controller: ImageDetailDialogController,
      controllerAs: 'detailController',
      clickOutsideToClose: true,
      locals: {
        image: image
      }
    })
    .then(function (data) {

    }, function () {

    })
  }

  this.image = {
    file: null
  }

  this.triggerGetImageListTimeout = null

  this.refetchCallback = null

  function doGetImageList () {
    if (vm.refetchCallback) vm.refetchCallback()
    vm.triggerGetImageListTimeout = null
  }

  function triggerGetImageList () {
    if (vm.triggerGetImageListTimeout) clearTimeout(vm.triggerGetImageListTimeout)

    vm.triggerGetImageListTimeout = setTimeout(doGetImageList, 300)
  }

  this.tagSearchChanged = function () {
    if (vm.filter.tags.length === 0) vm.filter.tags = null
    triggerGetImageList()
  }

  socket.auto('image created', triggerGetImageList, $scope)
  socket.auto('image deleted', triggerGetImageList, $scope)
  socket.auto('image updated', triggerGetImageList, $scope)
}
