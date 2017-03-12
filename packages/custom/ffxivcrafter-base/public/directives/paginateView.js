'use strict'

angular.module('mean.ffxivCrafter_base').directive('paginateView', function () {
  return {
    templateUrl: '/ffxivCrafter_base/views/paginate/paginateView.html',
    transclude: true,
    controllerAs: 'paginateViewController',
    controller: PaginateViewController
  }
})

PaginateViewController.$inject = []

function PaginateViewController () {

}
