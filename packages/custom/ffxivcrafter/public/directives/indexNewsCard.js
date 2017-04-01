'use strict'

angular.module('mean.ffxivCrafter')
.directive('indexNewsCard', IndexNewsCardDirective)

function IndexNewsCardDirective () {
  return {
    controller: IndexNewsCardController,
    controllerAs: 'indexNewsCardController',
    templateUrl: '/ffxivCrafter/views/system/indexNewsCard.html'
  }
}

IndexNewsCardController.$inject = ['ApplicationSetting']

function IndexNewsCardController (ApplicationSetting) {
  let vm = this
  this.newsText = 'Loading'

  ApplicationSetting.query({name: 'newsText'})
  .$promise
  .then(function (response) {
    if (response.length === 0) vm.newsText = 'Sorry no news data available'
    else vm.newsText = response[0].text
  })
}
