'use strict'

angular.module('mean.ffxivCrafter').factory('StockService', ['$http', function ($http) {
  return {
    addToStock: function (project, item, amount, hq) {
      $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + amount + '/' + hq)
        .then(function (result) {})
    }
  }
}])
