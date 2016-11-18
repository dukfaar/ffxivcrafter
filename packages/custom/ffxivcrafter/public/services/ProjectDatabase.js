'use strict'

angular.module('mean.ffxivCrafter').factory('ProjectDatabase', ['Project', function (Project) {
  var projects = {}

  return {
    get: function(id) {
      if(!projects[id]) projects[id] = Project.get({id: id})
      return projects[id]
    }
  }
}])
