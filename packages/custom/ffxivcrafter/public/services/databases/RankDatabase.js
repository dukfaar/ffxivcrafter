'use strict'

angular.module('mean.ffxivCrafter').factory('RankDatabase', ['Rank', function (Rank) {
  var ranks = {}

  return {
    get: function(id) {
      if(!ranks[id]) ranks[id] = Rank.get({id: id})
      return ranks[id]
    }
  }
}])
