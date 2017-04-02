'use strict'

angular.module('mean.ffxivCrafter_base').config(ThemeConfig)

ThemeConfig.$inject = ['$mdThemingProvider']

function ThemeConfig ($mdThemingProvider) {
  var theme = $mdThemingProvider.theme('default')

  var blackPalette = $mdThemingProvider.extendPalette('grey', {
    'A400': '#000000',
    'A200': '#303030'
  })

  $mdThemingProvider.definePalette('black', blackPalette)

  if (window.localStorage.getItem('primaryPalette') === null) window.localStorage.setItem('primaryPalette', 'indigo')
  if (window.localStorage.getItem('accentPalette') === null) window.localStorage.setItem('accentPalette', 'pink')
  if (window.localStorage.getItem('backgroundPalette') === null) window.localStorage.setItem('backgroundPalette', 'grey')
  if (window.localStorage.getItem('darkPalette') === null) window.localStorage.setItem('darkPalette', false)

  theme.primaryPalette(window.localStorage.getItem('primaryPalette'))
  theme.accentPalette(window.localStorage.getItem('accentPalette'))
  theme.warnPalette('red')
  theme.backgroundPalette(window.localStorage.getItem('backgroundPalette'))

  if (JSON.parse(window.localStorage.getItem('darkPalette')) === true) theme.dark()
}
