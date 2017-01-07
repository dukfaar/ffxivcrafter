'use strict'

angular.module('mean.ffxivCrafter').factory('LanguageService', ['localStorageService', '$translate',
function (localStorageService, $translate) {
  if(!localStorageService.get('app.language')) localStorageService.set('app.language', 'en')
  $translate.use(localStorageService.get('app.language'))

  return {
    get: function () {
      return localStorageService.get('app.language')
    },
    set: function (lang) {
      localStorageService.set('app.language', lang)
      $translate.use(lang)
    }
  }
}])
