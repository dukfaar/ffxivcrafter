'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectService',
  ['_',
  function (_) {
    function doRecurseSteps(step, callback) {
      callback(step)

      _.forEach(step.inputs, i => doRecurseSteps(i, callback))
    }

    return {
      isHiddenFromOverview: function (project, user) {
        if(!project.hiddenOnOverviewBy) project.hiddenOnOverviewBy = []
        return _.find(project.hiddenOnOverviewBy, function (u) { return u === user._id }) !== undefined
      },
      recurseProjectSteps: (project, callback) => {
        return doRecurseSteps(project.tree, callback)
      }
    }
  }
])
