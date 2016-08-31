'use strict';

angular.module('mean.system').directive('craftingTreeItem',function() {
  return {
    templateUrl:'/meanStarter/views/crafting/craftingTreeItem.html',
    scope: {
      tree: '='
    }
  };
});
