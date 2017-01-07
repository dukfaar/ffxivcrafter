'use strict'

angular.module('mean.ffxivCrafter')
  .config(function () {
  })

angular.module('mean.ffxivCrafter').directive('languageSelect', function () {
  return {
    templateUrl: "/ffxivCrafter/views/system/languageSelect.html",
    scope: {

    },
    controller: function ($scope, $translate, LanguageService) {
      $scope.language = {
        list: [ 'en', 'de' ],
        current: LanguageService.get()
      }

      $scope.setLanguage = function(lang) {
        $scope.language.current = lang
        LanguageService.set(lang)
      }
    }
  }
})
