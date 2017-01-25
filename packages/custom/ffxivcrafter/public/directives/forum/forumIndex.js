'use strict'

angular.module('mean.ffxivCrafter').directive('forumIndex', function () {
  return {
    templateUrl: '/ffxivCrafter/views/forum/index.html',
    scope: {
    },
    controller: function ($scope, $q, _, ForumCategory, $mdToast, socket, $mdDialog) {
       ForumCategory.query({parent: null})
       .$promise.then(function (result) {
        if(result.length > 0) {
          $scope.indexCategory = result[0]
        } else {
          var newIndex = new ForumCategory({name: 'Home', parent: null})
          newIndex.$save().then(function(result) {
            $scope.indexCategory = result
          })
        }
      })
    }
  }
})
