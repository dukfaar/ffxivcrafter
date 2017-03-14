'use strict'

angular.module('mean.ffxivCrafter_gallery').directive('rcGallery',function () {
  return {
    controller: GalleryController,
    controllerAs: 'galleryController',
    templateUrl: '/ffxivCrafter_gallery/views/gallery.html',
  }
})

GalleryController.$inject = ['$scope', '$http', 'Analytics', 'Upload', '_', 'socket', '$mdDialog']

function GalleryController ($scope, $http, Analytics, Upload, _, socket, $mdDialog) {
  this.getImageList = function () {
    $http.get('/api/image')
    .then(function (result) {
      this.imageList = result.data
    }.bind(this))
  }

  this.uploadImage = function (file) {
    return Upload.upload({
      url: '/api/image',
      data: { file: file }
    })
  }

  this.uploadDroppedFiles = function (files) {
    _.forEach(files, (file) => {
      this.uploadImage(file)
    })
  }



  function ImageDetailDialogController ($scope, image, $http, $mdDialog, UserDatabase) {
    this.image = image
    this.UserDatabase = UserDatabase

    this.updateImage = function (image) {
      $http.put('/api/image/'+image._id, image)
    }

    this.deleteImage = function (image) {
      $mdDialog.show(
        $mdDialog.confirm()
        .title('Confirm deletion')
        .textContent('Do you really want to delete this image?')
        .ok('Yes, just do it')
        .cancel('No!')
      )
      .then(function() {
        $http.delete('/api/image/' + image._id)
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

    }, function() {

    })
  }

  this.filter = {
    tag: ""
  }

  this.tagFilter = function (image) {
    var tag = _.trim(this.filter.tag)
    if(tag.length === 0) return true

    var tags = image.tags || []
    return _.includes(tags, tag)
  }

  this.imageList = []

  this.getImageList()

  this.image = {
    file: null
  }

  this.uploadFile = function () {
    this.uploadImage(this.image.file)
  }

  this.triggerGetImageListTimeout = null

  function doGetImageList () {
    this.getImageList()
    this.triggerGetImageListTimeout = null
  }

  function triggerGetImageList () {
    if(this.triggerGetImageListTimeout) clearTimeout(this.triggerGetImageListTimeout)

    this.triggerGetImageListTimeout = setTimeout(doGetImageList.bind(this),300)
  }

  socket.on('image created', triggerGetImageList.bind(this))
  socket.on('image deleted', triggerGetImageList.bind(this))

  $scope.$on('$destroy', function () {
    socket.off('image created', triggerGetImageList.bind(this))
    socket.off('image deleted', triggerGetImageList.bind(this))
  }.bind(this))
}
