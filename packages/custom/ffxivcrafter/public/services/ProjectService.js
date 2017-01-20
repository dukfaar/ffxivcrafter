'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectService',
  ['_',
  function (_) {
    return {
      isHiddenFromOverview: function (project, user) {
        if(!project.hiddenOnOverviewBy) project.hiddenOnOverviewBy = []
        return _.find(project.hiddenOnOverviewBy, function (u) { return u === user._id }) !== undefined
      }
    }
  }
])
