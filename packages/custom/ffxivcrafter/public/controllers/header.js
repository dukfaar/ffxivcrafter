'use strict'

angular.module('mean.ffxivCrafter').controller('HeaderController', HeaderController)

HeaderController.$inject = ['$scope', '$rootScope', 'Menus', 'MeanUser', '$state', '$mdSidenav', '$window', 'UserService']

function HeaderController ($scope, $rootScope, Menus, MeanUser, $state, $mdSidenav, $window, UserService) {
  $scope.allowed = function (perm) {
    return MeanUser.acl.allowed && MeanUser.acl.allowed.indexOf(perm) != -1
  }

  $scope.inElectronApp = function () {
    return $window.isInElectronApp === true
  }

  var vm = this

  vm.menus = {}
  vm.hdrvars = {
    authenticated: MeanUser.loggedin,
    user: UserService.user,
    isAdmin: MeanUser.isAdmin
  }

  $scope.closeMainSideNav = function () {
    $mdSidenav('mainSideNav').close()
  }

    // Default hard coded menu items for main menu
  var defaultMainMenu = [
  ]

    // Query menus added by modules. Only returns menus that user is allowed to see.
  function queryMenu (name, defaultMenu) {
    Menus.query({
      name: name,
      defaultMenu: defaultMenu
    }, function (menu) {
      vm.menus[name] = menu
    })
  }

    // Query server for menus and check permissions
  queryMenu('main', defaultMainMenu)
  queryMenu('account', [])

  $scope.isCollapsed = false

  $rootScope.$on('loggedin', function () {
    queryMenu('main', defaultMainMenu)
    queryMenu('account', [])

    vm.hdrvars = {
      authenticated: MeanUser.loggedin,
      user: UserService.user,
      isAdmin: MeanUser.isAdmin
    }

    UserService.regrabUser()
  })

  vm.logout = function () {
    MeanUser.logout()
  }

  $rootScope.$on('logout', function () {
    vm.hdrvars = {
      authenticated: false,
      user: {},
      isAdmin: false
    }
    queryMenu('main', defaultMainMenu)
    queryMenu('account', [])
    UserService.regrabUser()
    $state.go('home')
  })

  $scope.openAdminPanel = function () {
    $mdSidenav('left').open()
  }
}
