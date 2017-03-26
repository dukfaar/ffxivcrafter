'use strict'

angular.module('mean.ffxivCrafter')
.directive('accountSettings', AccountSettingsDirective)

function AccountSettingsDirective () {
  return {
    controller: AccountSettingsController,
    controllerAs: 'accountSettingsController',
    templateUrl: '/ffxivCrafter/views/account/accountSettings.html'
  }
}

AccountSettingsController.$inject = ['UserService']

function AccountSettingsController (UserService) {
  this.UserService = UserService
}
