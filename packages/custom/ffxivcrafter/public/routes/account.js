'use strict'

angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('account settings', {
      url: '/account/settings',
      template: '<account-settings></account-settings>'
    })
  }
])
