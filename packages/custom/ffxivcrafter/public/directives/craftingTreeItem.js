'use strict';

angular.module('mean.ffxivCrafter').directive('craftingTreeItem',function() {
  return {
    templateUrl:'/ffxivCrafter/views/crafting/craftingTreeItem.html',
    scope: {
      tree: '='
    }
  };
});
