'use strict'

angular.module('mean.ffxivCrafter_gallery').directive('rcGallery', function () {
  return {
    controller: GalleryController,
    controllerAs: 'galleryController',
    templateUrl: '/ffxivCrafter_gallery/views/gallery.html'
  }
})

GalleryController.$inject = ['$scope', '$http', 'Analytics', 'Upload', '_', 'socket', '$mdDialog', 'Image', '$q']

function GalleryController ($scope, $http, Analytics, Upload, _, socket, $mdDialog, Image, $q) {
  this.Image = Image

  this.filter = {
    tags: null
  }

  this.resetFileuploadValues = function () {
    this.filesToUpload = 0
    this.filesDone = 0
    this.totalProgress = 0
    this.fileProgress = 0
  }

  this.resetFileuploadValues()

  this.uploadImage = function (file) {
    return Upload.upload({
      url: '/api/image',
      data: { file: file }
    })
  }

  this.uploadDroppedFiles = function (files) {
    this.filesToUpload = files.length
    _.reduce(files, (promise, file) => {
      return promise.then(() => {
        this.fileProgress = 0
        return this.uploadImage(file)
      })
      .then((resp) => {
        this.filesDone ++
        this.totalProgress = 100.0 * (this.filesDone / this.filesToUpload)
      }, (err) => {
        console.error(err)
      }, (progress) => {
        if (progress) this.fileProgress = 100.0 * progress.loaded / progress.total
      })
    }, $q.when())
    .then(() => {
      this.resetFileuploadValues()
    })
  }

  function ImageDetailDialogController ($scope, image, $http, $mdDialog, UserDatabase, Image, UserService) {
    this.image = image
    this.UserDatabase = UserDatabase

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

  this.uploadFile = function () {
    this.uploadImage(this.image.file)
  }

  this.triggerGetImageListTimeout = null

  this.refetchCallback = null

  function doGetImageList () {
    if (this.refetchCallback) this.refetchCallback()
    this.triggerGetImageListTimeout = null
  }

  function triggerGetImageList () {
    if (this.triggerGetImageListTimeout) clearTimeout(this.triggerGetImageListTimeout)

    this.triggerGetImageListTimeout = setTimeout(doGetImageList.bind(this), 300)
  }

  this.tagSearchChanged = function () {
    if (this.filter.tags.length === 0) this.filter.tags = null
    triggerGetImageList.bind(this)()
  }

  socket.on('image created', triggerGetImageList.bind(this))
  socket.on('image deleted', triggerGetImageList.bind(this))
  socket.on('image updated', triggerGetImageList.bind(this))

  $scope.$on('$destroy', function () {
    socket.off('image created', triggerGetImageList.bind(this))
    socket.off('image deleted', triggerGetImageList.bind(this))
    socket.off('image updated', triggerGetImageList.bind(this))
  }.bind(this))
}
