'use strict'

angular.module('mean.ffxivCrafter_base')
.config(['AnalyticsProvider', function (AnalyticsProvider) {
  AnalyticsProvider.setAccount('UA-93214762-1')
  AnalyticsProvider.trackPages(true)
  AnalyticsProvider.trackUrlParams(true)
  AnalyticsProvider.setPageEvent('$stateChangeSuccess')
}])
.run(['Analytics', function (Analytics) {

}])
