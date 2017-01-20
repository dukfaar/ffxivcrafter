'use strict'

angular.module('mean.ffxivCrafter').factory('RecipeDatabase', ['Recipe', function (Recipe) {
  var recipes = {}

  return {
    get: function(id) {
      if(!recipes[id]) recipes[id] = Recipe.get({id: id})
      return recipes[id]
    }
  }
}])
