'use strict'

angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    $meanStateProvider
    .state('pm overview', {
      url: '/projectManager/overview',
      template: '<project-manager-overview></project-manager-overview>',
      requiredCircles: {
        circles: ['projectManager']
      }
    })
    .state('pm kanban', {
      url: '/projectManager/kanban',
      template: '<project-manager-kanban></project-manager-kanban>',
      requiredCircles: {
        circles: ['see kanban board']
      }
    })
  }
])
