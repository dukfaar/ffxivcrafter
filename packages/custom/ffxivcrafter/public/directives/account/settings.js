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

AccountSettingsController.$inject = ['$scope', 'UserService', 'UserCombatClasses', 'UserBirthday', 'UserDataService']

function AccountSettingsController ($scope, UserService, UserCombatClasses, UserBirthday, UserDataService) {
  let vm = this
  this.UserService = UserService
  this.userCombatClasses = null
  this.updateCombatClasses = updateCombatClasses
  this.birthday = null
  this.updateBirthday = updateBirthday

  $scope.$on(('userservice refetched user'), () => {
    fetchCombatClasses()
    fetchBirthday()
  })

  function fetchCombatClasses () {
    UserDataService.fetchOrCreateUserData(UserCombatClasses)
    .then(userCombatClasses => {
      vm.userCombatClasses = userCombatClasses
    })
  }

  function fetchBirthday () {
    UserDataService.fetchOrCreateUserData(UserBirthday)
    .then(birthday => {
      vm.birthday = birthday
      vm.birthday.birthday = new Date(vm.birthday.birthday)
    })
  }

  function updateBirthday () {
    UserBirthday.update({id: vm.birthday._id}, vm.birthday)
  }

  function updateCombatClasses () {
    UserCombatClasses.update({id: vm.userCombatClasses._id}, vm.userCombatClasses)
  }
}
