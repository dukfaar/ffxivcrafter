'use strict'

angular.module('mean.ffxivCrafter')
  .config(function ($mdThemingProvider) {
    var theme = $mdThemingProvider.theme('default')

    var blackPalette = $mdThemingProvider.extendPalette('grey', {
      'A400': '#000000',
      'A200': '#303030'
    })

    $mdThemingProvider.definePalette('black', blackPalette)

    if(window.localStorage.getItem('primaryPalette') == null) window.localStorage.setItem('primaryPalette', 'indigo')
    if(window.localStorage.getItem('accentPalette') == null) window.localStorage.setItem('accentPalette', 'pink')
    if(window.localStorage.getItem('backgroundPalette') == null) window.localStorage.setItem('backgroundPalette', 'grey')
    if(window.localStorage.getItem('darkPalette') == null) window.localStorage.setItem('darkPalette', false)


    theme.primaryPalette(window.localStorage.getItem('primaryPalette'))
    theme.accentPalette(window.localStorage.getItem('accentPalette'))
    theme.warnPalette('red')
    theme.backgroundPalette(window.localStorage.getItem('backgroundPalette'))

    if(JSON.parse(window.localStorage.getItem('darkPalette')) === true) theme.dark()
  })

angular.module('mean.ffxivCrafter').controller('ThemeController',
  function ($scope) {
    $scope.palettes = {
      primary: window.localStorage.getItem('primaryPalette'),
      accent: window.localStorage.getItem('accentPalette'),
      background: window.localStorage.getItem('backgroundPalette'),
      dark: JSON.parse(window.localStorage.getItem('darkPalette'))
    }

    $scope.paletteList = [
      'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey', 'black'
    ]

    $scope.setPrimary = function (palette) {
      window.localStorage.setItem('primaryPalette',palette)
    }

    $scope.setAccent = function (palette) {
      window.localStorage.setItem('accentPalette',palette)
    }

    $scope.setBackground = function (palette) {
      window.localStorage.setItem('backgroundPalette',palette)
    }

    $scope.setDark = function (palette) {
      window.localStorage.setItem('darkPalette',palette)
    }
  }
)
