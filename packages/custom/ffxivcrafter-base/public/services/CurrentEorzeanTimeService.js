'use strict'

angular.module('mean.ffxivCrafter_base')
.factory('CurrentEorzeanTimeService', CurrentEorzeanTimeService)

CurrentEorzeanTimeService.$inject = ['EorzeanTimeService', '$interval']

function CurrentEorzeanTimeService (EorzeanTimeService, $interval) {
  var service = {
    currentEorzeanTime: EorzeanTimeService.getEorzeanTime()
  }

  $interval(function () {
    service.currentEorzeanTime = EorzeanTimeService.getEorzeanTime()
  }, 1000)

  return service
}
