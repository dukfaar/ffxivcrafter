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
  this.FileUpload = FileUpload.getUploader('/api/newsletter/upload')
  this.UserDatabase = UserDatabase
  this.doGetList = doGetList
  this.updateNewsletter = updateNewsletter

  this.triggerGetListTimeout = null

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
