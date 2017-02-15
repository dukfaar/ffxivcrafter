'use strict'

angular.module('mean.ffxivCrafter').controller('MainAppController',
  ['$scope', '$mdSidenav', '$q', '$mdMedia', 'SubmissionNotifyService',
  'PublicProjectCraftableNotifyService', 'ForumPostNotifyService', '$window',
    function ($scope, $mdSidenav, $q, $mdMedia, SubmissionNotifyService,
      PublicProjectCraftableNotifyService, ForumPostNotifyService, $window) {
      if (window.localStorage.getItem('navigation.mode') === null) window.localStorage.setItem('navigation.mode', 'top')

      $scope.navigation = {
        mode: window.localStorage.getItem('navigation.mode')
      }

      $scope.openSideNav = function () {
        $mdSidenav('mainSideNav').open()
      }

      $scope.closeSideNav = function () {
        $mdSidenav('mainSideNav').close()
      }

      $scope.onSwipeRight = function () {
        if ($scope.navigation.mode === 'side' || $scope.useMobile()) $scope.openSideNav()
      }

      $scope.onSwipeLeft = function () {
        if ($scope.navigation.mode === 'side' || $scope.useMobile()) $scope.closeSideNav()
      }

      $scope.useMobile = function () {
        return $mdMedia('sm') || $mdMedia('xs')
      }

      $scope.inElectronApp = function () {
        return $window.isInElectronApp === true
      }

      $scope.lockOpenSidenav = function () {
        return $mdMedia('gt-sm')
      }

      $scope.close = function () {
        $window.close()
      }

      $scope.maximize = function () {
        $window.ipcRenderer.send('maximize window', {})
      }
    }
  ])
