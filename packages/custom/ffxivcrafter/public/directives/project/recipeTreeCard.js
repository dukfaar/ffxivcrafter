'use strict'

angular.module('mean.ffxivCrafter').directive('projectRecipeTreeCard',function() {
  return {
    templateUrl:'/ffxivCrafter/views/project/recipeTreeCard.html',
    require: '^^projectView'
  }
})
