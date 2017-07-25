'use strict'

angular.module('mean.ffxivCrafter_bot')
.directive('uselessfactsManager', UselessFactsManagerDirective)

function UselessFactsManagerDirective () {
  return {
    controller: UselessFactsManagerDirectiveController,
    controllerAs: 'uselessfactManagerController',
    templateUrl: '/ffxivCrafter_bot/views/uselessfactsmanager.html'
  }
}

UselessFactsManagerDirectiveController.$inject = ['$scope', '_', '$q', 'socket', 'UselessFact']

function UselessFactsManagerDirectiveController ($scope, _, $q, socket, UselessFact) {
  let vm = this
  this.addFact = addFact
  this.deleteFact = deleteFact
  this.updateFact = updateFact

  this.triggerGetListTimeout = null

  socket.auto('UselessFact created', triggerGetList, $scope)
  socket.auto('UselessFact deleted', triggerGetList, $scope)
  socket.auto('UselessFact updated', triggerGetList, $scope)

  doGetList()

  function doGetList () {
    UselessFact.query({})
    .$promise.then(result => {
      vm.factList = result
    })

    vm.triggerGetListTimeout = null
  }

  function triggerGetList () {
    if (vm.triggerGetListTimeout) clearTimeout(vm.triggerGetListTimeout)

    vm.triggerGetListTimeout = setTimeout(doGetList, 300)
  }

  function addFact () {
    let newFact = new UselessFact()
    newFact.$save()
  }

  function deleteFact (fact) {
    UselessFact.delete({id: fact._id})
  }

  function updateFact (fact) {
    UselessFact.update({id: fact._id}, fact)
  }
}
