'use strict'

angular.module('mean.ffxivCrafter')
.directive('crudView', CrudViewDirective)

function CrudViewDirective () {
  return {
    controller: CrudViewController,
    controllerAs: 'crudViewController',
    templateUrl: 'ffxivCrafter/views/crud/view.html'
  }
}

CrudViewController.$inject = ['$http', '$stateParams']

function CrudViewController ($http, $stateParams) {
  let vm = this

  $http.get('/api/schema/' + $stateParams.modelName)
  .then(response => {
    vm.schema = response.data
  })

  $http.get('/api/crud/' + $stateParams.modelName + '/' + $stateParams.id)
  .then(response => {
    vm.data = response.data
  })
}
