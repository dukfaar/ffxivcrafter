'use strict'

angular.module('mean.ffxivCrafter').directive('recipeTreeCard',function() {
  return {
    templateUrl:'/ffxivCrafter/views/crafting/craftingTreeItem.html',
    scope: {
      tree: '='
    }
  }
})
