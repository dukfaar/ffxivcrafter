'use strict'

angular.module('mean.ffxivCrafter').factory('deliveryService', [ '$http', '$mdDialog',
  function ($http, $mdDialog) {
    var instance = {}

    instance.deliveryDialog = function (project, item, gathers, callback) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/project/deliveryDialog.html',
        parent: angular.element(document.body),
        controller: 'DeliveryDialogController',
        clickOutsideToClose: true,
        locals: {
          item: item,
          gathers: gathers
        }
      }).then(function (amount) {
        if (amount > 0) {
          $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + amount + '/' + (gathers.hq ? 'true' : 'false'))
            .then(function (result) {
              callback()
            })
        }
      })
    }

    instance.deliveryCraftDialog = function (project, item, step, craftable, callback) {
      $mdDialog.show({
        templateUrl: 'ffxivCrafter/views/project/deliveryCraftDialog.html',
        parent: angular.element(document.body),
        controller: 'DeliveryCraftDialogController',
        clickOutsideToClose: true,
        locals: {
          item: item,
          craftable: craftable
        }
      }).then(function (data) {
        if (data.amount > 0) {
          var stepsDone = data.amount / step.recipe.outputs[0].amount

          function handleInput (index) {
            if (index >= step.recipe.inputs.length) {
              callback()
            } else {
              $http.post('/api/project/stock/add/' + project._id + '/' + step.recipe.inputs[index].item + '/' + (-stepsDone * step.recipe.inputs[index].amount) + '/' + (craftable.step.inputs[index].hq ? 'true' : 'false'))
                .then(function (result) {
                  handleInput(index + 1)
                })
            }
          }

          $http.post('/api/project/stock/add/' + project._id + '/' + item._id + '/' + data.amount + '/' + (craftable.step.hq ? 'true' : 'false'))
            .then(function (result) {
              if (data.craftedFromStock) {
                handleInput(0)
              } else {
                callback()
              }
            })
        }
      })
    }

    return instance
  }
])
