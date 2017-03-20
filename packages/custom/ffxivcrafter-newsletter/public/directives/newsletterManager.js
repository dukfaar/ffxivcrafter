'use strict'

angular.module('mean.ffxivCrafter_newsletter')
.directive('newsletterManager', NewsletterManagerDirective)

function NewsletterManagerDirective () {
  return {
    controller: NewsletterManagerDirectiveController,
    controllerAs: 'newsletterManagerController',
    templateUrl: '/ffxivCrafter_newsletter/views/manager.html'
  }
}

NewsletterManagerDirectiveController.$inject = ['$scope', 'Upload', '_', '$q', 'socket', 'Newsletter', 'UserDatabase']

function NewsletterManagerDirectiveController ($scope, Upload, _, $q, socket, Newsletter, UserDatabase) {
  this.uploadDroppedFiles = uploadDroppedFiles
  this.uploadFile = uploadFile
  this.resetFileuploadValues = resetFileuploadValues
  this.UserDatabase = UserDatabase
  this.doGetList = doGetList
  this.updateNewsletter = updateNewsletter

  this.triggerGetListTimeout = null

  this.resetFileuploadValues()
  this.doGetList()

  socket.on('newsletter created', triggerGetList.bind(this))
  socket.on('newsletter deleted', triggerGetList.bind(this))
  socket.on('newsletter updated', triggerGetList.bind(this))

  $scope.$on('$destroy', function () {
    socket.off('newsletter created', triggerGetList.bind(this))
    socket.off('newsletter deleted', triggerGetList.bind(this))
    socket.off('newsletter updated', triggerGetList.bind(this))
  }.bind(this))

  function doGetList () {
    this.newsletterList = Newsletter.query({})

    this.triggerGetListTimeout = null
  }

  function triggerGetList () {
    if (this.triggerGetListTimeout) clearTimeout(this.triggerGetListTimeout)

    this.triggerGetListTimeout = setTimeout(doGetList.bind(this), 300)
  }

  function uploadFile (file) {
    return Upload.upload({
      url: '/api/newsletter/upload',
      data: { file: file }
    })
  }

  function uploadDroppedFiles (files) {
    this.filesToUpload = files.length
    _.reduce(files, (promise, file) => {
      return promise.then(() => {
        this.fileProgress = 0
        return this.uploadFile(file)
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

  function resetFileuploadValues () {
    this.filesToUpload = 0
    this.filesDone = 0
    this.totalProgress = 0
    this.fileProgress = 0
  }

  function updateNewsletter (newsletter) {
    if (newsletter.isCurrent) {
      _.forEach(
        _.filter(this.newsletterList, (n) => { return n.isCurrent && n._id !== newsletter._id }),
        function (n) {
          n.isCurrent = false
          Newsletter.update({id: n._id}, n)
        }
      )
    }

    return Newsletter.update({id: newsletter._id}, newsletter)
  }
}
