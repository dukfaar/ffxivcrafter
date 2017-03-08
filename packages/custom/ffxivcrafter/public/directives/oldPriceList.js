'use strict'

angular.module('mean.ffxivCrafter').directive('oldPriceList', function () {
  return {
    templateUrl: '/ffxivCrafter/views/system/oldPriceList.html',
    scope: {},
    controller: function ($scope, $http, $mdDialog, Analytics) {
      $scope.oldItems = []

      $scope.updateOldList = function () {
        $http.get('api/item/oldest')
            .then(function (response) {
              $scope.oldItems = response.data
            })
      }

      $scope.priceDialog = function (item) {
        $mdDialog.show({
          templateUrl: 'ffxivCrafter/views/item/priceDialogFront.html',
          parent: angular.element(document.body),
          controller: 'ItemPriceDialogController',
          clickOutsideToClose: true,
          locals: {
            item: item,
            priceUpdate: null
          }
        }).then(function () {
          Analytics.trackEvent(['priceupdatedialog', 'send', 'oldlist'])
          $scope.updateOldList()
        })
      }

      $scope.updateOldList()
    }
  }
})
