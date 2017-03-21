'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('FileUpload', FileUploadService)

FileUploadService.$inject = ['Upload' , '_', '$q']

function FileUploadService (Upload, _, $q) {
  var service = {
    getUploader: (url) => { return new Uploader(url) }
  }

  return service

  function Uploader (_url) {
    let url = _url

    this.uploadData = {
    }

    this.uploadFile = uploadFile
    this.uploadFiles = uploadFiles

    resetFileuploadValues.bind(this)()

    function resetFileuploadValues () {
      this.uploadData.filesToUpload = 0
      this.uploadData.filesDone = 0
      this.uploadData.totalProgress = 0
      this.uploadData.fileProgress = 0
    }

    function uploadFile (file) {
      return Upload.upload({
        url: url,
        data: { file: file }
      })
    }

    function uploadFiles (files) {
      this.uploadData.filesToUpload = files.length
      return _.reduce(files, (promise, file) => {
        return promise.then(() => {
          this.uploadData.fileProgress = 0
          return this.uploadFile(file)
        })
        .then((resp) => {
          this.uploadData.filesDone ++
          this.uploadData.totalProgress = 100.0 * (this.uploadData.filesDone / this.uploadData.filesToUpload)
        }, (err) => {
          console.error('Error while uploading file:' + err)
        }, (progress) => {
          if (progress) this.uploadData.fileProgress = 100.0 * progress.loaded / progress.total
        })
      }, $q.when())
      .then(() => {
        resetFileuploadValues.bind(this)()
      })
    }
  }
}
