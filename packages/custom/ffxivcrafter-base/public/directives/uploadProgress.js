'use strict'

angular.module('mean.ffxivCrafter_base')
.directive('uploadProgress', UploadProgressDirective)

function UploadProgressDirective () {
  return {
    controller: UploadProgressController,
    controllerAs: 'uploadProgressController',
    templateUrl: '/ffxivCrafter_base/views/uploadProgress.html',
    bindToController: {
      uploadData: '='
    }
  }
}

UploadProgressController.$inject = []

function UploadProgressController () {

}
