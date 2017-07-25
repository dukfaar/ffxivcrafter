'use strict'

angular.module('mean.ffxivCrafter')
.directive('crudEdit', CrudEditDirective)

function CrudEditDirective () {
  return {
    controller: CrudEditController,
    controllerAs: 'crudEditController',
    templateUrl: 'ffxivCrafter/views/crud/edit.html'
  }
}

CrudEditController.$inject = ['$http', '$stateParams']

function CrudEditController ($http, $stateParams) {
  let vm = this
  this.updateInstance = updateInstance

  $http.get('/api/schema/' + $stateParams.modelName)
  .then(response => {
    vm.schema = response.data
  })

  $http.get('/api/crud/' + $stateParams.modelName + '/' + $stateParams.id)
  .then(response => {
    vm.data = response.data
  })

  function updateInstance () {
    $http.put('/api/crud/' + $stateParams.modelName + '/' + $stateParams.id, vm.data)
  }
}
