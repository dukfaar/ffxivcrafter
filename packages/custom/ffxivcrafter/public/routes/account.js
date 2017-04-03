'use strict'

angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('account settings', {
      url: '/account/settings',
      template: '<account-settings></account-settings>'
    })
    .state('account profile', {
      url: '/account/profile/:id',
      template: function ($stateParams) { return '<account-profile user-id="\'' + $stateParams.id + '\'"></account-profile>' },
      requiredCircles: {
        circles: ['see profile']
      }
    })
  }
])
