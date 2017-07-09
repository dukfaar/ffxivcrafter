'use strict'

angular.module('mean.ffxivCrafter').directive('projectInvolvedItems', function () {
  return {
    templateUrl: '/ffxivCrafter/views/project/involvedItems.html',
    scope: {
      project: '='
    },
    controller: InvolvedItemsController,
    controllerAs: 'involvedItemsController'
  }
})

InvolvedItemsController.$inject = ['$scope', 'ProjectService', '_']

function InvolvedItemsController ($scope, ProjectService, _) {
  let vm = this
  vm.itemList = []

  vm.updateAllPricesInItemList = updateAllPricesInItemList

  $scope.$watch('project', () => {
    buildItemList($scope.project)
  })

  function buildItemList (project) {
    vm.itemList = []

    let itemDictionary = {}

    ProjectService.recurseProjectSteps(project, step => {
      itemDictionary[step.item._id] = step.item
    })

    _.forEach(itemDictionary, item => {
      vm.itemList.push(item)
    })
  }

  function updateAllPricesInItemList() {
    _.forEach(vm.itemList, item => {
      $http.put('/api/price/' + item._id + '/' + item.price + '/' + item.priceHQ)
    })
  }
}
