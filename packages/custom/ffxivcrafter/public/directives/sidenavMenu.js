'use strict'

angular.module('mean.ffxivCrafter')
.directive('sidenavMenu', SidenavMenuDirective)

function SidenavMenuDirective () {
  return {
    templateUrl: '/ffxivCrafter/views/system/sidenavMenu.html',
    controller: SidenavMenuController,
    controllerAs: 'sidenavMenuController',
    bindToController: {
      menus: '=',
      fontSize: '@'
    },
    scope: true
  }
}

SidenavMenuController.$inject = []

function SidenavMenuController () {
}
