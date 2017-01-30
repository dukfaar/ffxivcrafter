'use strict'

angular.module('mean.ffxivCrafter').directive('projectSettingsCard',function() {
  return {
    templateUrl:'/ffxivCrafter/views/project/settingsCard.html',
    require: '^^projectView'
  }
})
