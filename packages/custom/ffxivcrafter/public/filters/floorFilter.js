'use strict'

angular.module('mean.ffxivCrafter').filter('floor', function () {
  return function (inputNumber) {
    return Math.floor(inputNumber)
  }
})
