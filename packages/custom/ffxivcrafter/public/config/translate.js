angular.module('mean.ffxivCrafter').config(function ($translateProvider) {
  $translateProvider.preferredLanguage('en')

  $translateProvider.useStaticFilesLoader({
    prefix: 'ffxivcrafter/i18n/',
    suffix: '.json'
  })
})
