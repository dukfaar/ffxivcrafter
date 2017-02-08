'use strict'

//Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function($meanStateProvider) {
    $meanStateProvider
    .state('admin dashboard', {
      url: '/admin/dashboard',
      template: '<admin-dashboard></admin-dashboard>',
      requiredCircles: {
        circles: ['admin']
      }
    })
    .state('admin edit users', {
      url: '/admin/edit/users',
      template: '<admin-users></admin-users>',
      requiredCircles: {
        circles: ['edit users']
      }
    })
    .state('admin edit circles', {
      url: '/admin/edit/circles',
      template: '<admin-circles></admin-circles>',
      requiredCircles: {
        circles: ['edit circles']
      }
    })
  }
])
