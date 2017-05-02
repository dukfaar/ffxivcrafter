'use strict'

angular.module('mean.ffxivCrafter_newsletter')
.directive('newsletterArchive', NewsletterArchiveDirective)

function NewsletterArchiveDirective () {
  return {
    controller: NewsletterArchiveDirectiveController,
    controllerAs: 'newsletterArchiveController',
    templateUrl: '/ffxivCrafter_newsletter/views/archive.html'
  }
}

NewsletterArchiveDirectiveController.$inject = ['$scope', '_', '$q', 'socket', 'Newsletter', 'UserDatabase', 'FileUpload']

function NewsletterArchiveDirectiveController ($scope, _, $q, socket, Newsletter, UserDatabase, FileUpload) {
  let vm = this
  this.viewed = 0
  this.triggerGetListTimeout = null
  this.newsletterList = []

  doGetList()

  socket.auto('newsletter created', triggerGetList, $scope)
  socket.auto('newsletter deleted', triggerGetList, $scope)
  socket.auto('newsletter updated', triggerGetList, $scope)

  function doGetList () {
    Newsletter.query({})
    .$promise.then(result => {
      vm.newsletterList = result
    })

    vm.triggerGetListTimeout = null
  }

  function triggerGetList () {
    if (vm.triggerGetListTimeout) clearTimeout(vm.triggerGetListTimeout)

    vm.triggerGetListTimeout = setTimeout(doGetList, 300)
  }
}
