'use strict';

// Setting up route
angular.module('mean.ffxivCrafter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    // states for users
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        abstract: true,
        templateUrl: 'ffxivCrafter/views/users/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'ffxivCrafter/views/users/login.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'ffxivCrafter/views/users/register.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'ffxivCrafter/views/users/forgot-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'ffxivCrafter/views/users/reset-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      });
  }
]);
