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
    ApplicationSetting.update({id: vm.newsResource._id}, vm.newsResource)
  }

  function fetchNews () {
    ApplicationSetting.query({name: 'newsText'})
    .$promise
    .then(function (response) {
      if (response.length === 0) {
        let newSetting = new ApplicationSetting()
        newSetting.name = 'newsText'
        newSetting.text = ''
        newSetting.$save().then(vm.fetchNews)
      } else {
        vm.newsResource = response[0]
      }
    })
  }
}
