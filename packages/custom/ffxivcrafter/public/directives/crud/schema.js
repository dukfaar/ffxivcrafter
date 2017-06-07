'use strict'

angular.module('mean.ffxivCrafter')
.directive('crudSchema', CrudSchemaDirective)

function CrudSchemaDirective () {
  return {
    controller: CrudSchemaController,
    controllerAs: 'crudSchemaController',
    templateUrl: 'ffxivCrafter/views/crud/schema.html',
    bindToController: {
      modelName: '='
    },
    scope: true
  }
}

CrudSchemaController.$inject = ['$http', '$stateParams']

function CrudSchemaController ($http, $stateParams) {
  let vm = this

  $http.get('/api/schema/' + $stateParams.modelName)
  .then(function (response) {
    vm.schema = response.data
    console.log(vm.schema)
  })
}
