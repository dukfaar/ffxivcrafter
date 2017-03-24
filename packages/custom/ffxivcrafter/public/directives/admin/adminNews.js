'use strict'

angular.module('mean.ffxivCrafter')
.directive('adminNews', AdminNewsDirective)

function AdminNewsDirective () {
  return {
    controller: AdminNewsController,
    controllerAs: 'adminNewsController',
    templateUrl: '/ffxivCrafter/views/admin/edit-newspage.html'
  }
}

AdminNewsController.$inject = ['ApplicationSetting']

function AdminNewsController (ApplicationSetting) {
  let vm = this
  this.newsResource = null

  this.updateNews = updateNews
  this.fetchNews = fetchNews

  this.fetchNews()

  function updateNews () {
    ApplicationSetting.update({id: this.newsResource._id}, this.newsResource)
  }

  function fetchNews () {
    ApplicationSetting.query({name: 'newsText'})
    .$promise
    .then(function (response) {
      if (response.length === 0) {
        // TODO: create news object
        console.error('No newstext resource found, please create me')
      } else {
        vm.newsResource = response[0]
      }
    })
  }
}
