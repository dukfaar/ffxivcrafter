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

NewsletterManagerDirectiveController.$inject = ['$scope', '_', '$q', 'socket', 'Newsletter', 'UserDatabase', 'FileUpload']

function NewsletterManagerDirectiveController ($scope, _, $q, socket, Newsletter, UserDatabase, FileUpload) {
  let vm = this
  this.FileUpload = FileUpload.getUploader('/api/newsletter/upload')
  this.UserDatabase = UserDatabase
  this.doGetList = doGetList
  this.updateNewsletter = updateNewsletter

  this.triggerGetListTimeout = null

  this.doGetList()

  socket.on('newsletter created', triggerGetList)
  socket.on('newsletter deleted', triggerGetList)
  socket.on('newsletter updated', triggerGetList)

  $scope.$on('$destroy', function () {
    socket.off('newsletter created', triggerGetList)
    socket.off('newsletter deleted', triggerGetList)
    socket.off('newsletter updated', triggerGetList)
  })

  function doGetList () {
    vm.newsletterList = Newsletter.query({})

    vm.triggerGetListTimeout = null
  }

  function triggerGetList () {
    if (vm.triggerGetListTimeout) clearTimeout(vm.triggerGetListTimeout)

    vm.triggerGetListTimeout = setTimeout(doGetList, 300)
  }

  function updateNewsletter (newsletter) {
    if (newsletter.isCurrent) {
      _.forEach(
        _.filter(vm.newsletterList, (n) => { return n.isCurrent && n._id !== newsletter._id }),
        function (n) {
          n.isCurrent = false
          Newsletter.update({id: n._id}, n)
        }
      )
    }

    return Newsletter.update({id: newsletter._id}, newsletter)
  }
}
