'use strict'

angular.module('mean.ffxivCrafter').controller('MainAppController',
  ['$scope', '$mdSidenav', '$q', '$mdMedia', 'SubmissionNotifyService',
  'PublicProjectCraftableNotifyService', 'ForumPostNotifyService', '$window',
  'ImageCommentNotifyService',
    function ($scope, $mdSidenav, $q, $mdMedia, SubmissionNotifyService,
      PublicProjectCraftableNotifyService, ForumPostNotifyService, $window,
      ImageCommentNotifyService) {
      $scope.navigation = {
        mode: 'side'
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
