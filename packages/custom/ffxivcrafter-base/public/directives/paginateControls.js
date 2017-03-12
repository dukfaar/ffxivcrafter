'use strict'

angular.module('mean.ffxivCrafter_base').directive('paginateControls', function () {
  return {
    templateUrl: '/ffxivCrafter_base/views/paginate/paginateControls.html',
    controllerAs: 'paginateControlsController',
    controller: PaginateControlsController,
    bindToController: {
      pageButtons: '='
    }
  }
})

PaginateControlsController.$inject = []

function PaginateControlsController () {
  this.getPageArray = function (currentPage, maxPages) {
    var result = []
    for (var i = Math.max(0, currentPage - this.pageButtons);
        i < Math.min(currentPage + this.pageButtons + 1, maxPages);
        i++)
        result.push(i)

    return result
  }
}
