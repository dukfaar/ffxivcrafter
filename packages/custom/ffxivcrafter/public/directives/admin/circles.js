'use strict'

angular.module('mean.ffxivCrafter').directive('adminCircles', function () {
  return {
    templateUrl: '/ffxivCrafter/views/admin/circles.html',
    scope: {
    },
    controller: [
      '$scope', '$q', '_', 'UserService', 'Circle',
      function ($scope, $q, _, UserService, Circle) {
        $scope.UserService = UserService

        function fetchCircles () {
          $scope.circles = Circle.query({})

          $scope.circles.$promise.then(function (result) {
            _.forEach($scope.circles, (circle) => {
              circle.circles = _.flatten(circle.circles)
            })
          })
        }

        fetchCircles()

        $scope.updateCircle = function (circle) {
          Circle.update({id: circle._id}, circle).$promise.then(() => {
            circle = Circle.get({id: circle._id})
            circle.circles = _.flatten(circle.circles)
          })
        }
      }
    ]
  }
})
