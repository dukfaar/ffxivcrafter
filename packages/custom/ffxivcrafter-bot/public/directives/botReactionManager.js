'use strict'

angular.module('mean.ffxivCrafter_bot')
.directive('botReactionManager', BotReactionManagerDirective)

function BotReactionManagerDirective () {
  return {
    controller: BotReactionManagerDirectiveController,
    controllerAs: 'botReactionManagerController',
    templateUrl: '/ffxivCrafter_bot/views/botreactionmanager.html'
  }
}

BotReactionManagerDirectiveController.$inject = ['$scope', '_', '$q', 'socket', 'BotReaction']

function BotReactionManagerDirectiveController ($scope, _, $q, socket, BotReaction) {
  let vm = this
  this.addReaction = addReaction
  this.deleteReaction = deleteReaction
  this.updateReaction = updateReaction

  this.triggerGetListTimeout = null

  socket.auto('BotReaction created', triggerGetList, $scope)
  socket.auto('BotReaction deleted', triggerGetList, $scope)
  socket.auto('BotReaction updated', triggerGetList, $scope)

  doGetList()

  function doGetList () {
    BotReaction.query({})
    .$promise.then(result => {
      vm.reactionList = result
    })

    vm.triggerGetListTimeout = null
  }

  function triggerGetList () {
    if (vm.triggerGetListTimeout) clearTimeout(vm.triggerGetListTimeout)

    vm.triggerGetListTimeout = setTimeout(doGetList, 300)
  }

  function addReaction() {
    let newReaction = new BotReaction()
    newReaction.$save()
  }

  function deleteReaction(reaction) {
    BotReaction.delete({id: reaction._id})
  }

  function updateReaction (reaction) {
    BotReaction.update({id: reaction._id}, reaction)
  }
}
