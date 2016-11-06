'use strict'

angular.module('mean.ffxivCrafter').controller('AirshipController', ['$scope', 'Global', '$http', 'AirshipPart', '$timeout', '$q',
  function ($scope, Global, $http, AirshipPart, $timeout, $q) {
    $scope.AirshipPart = AirshipPart

    $scope.partList = AirshipPart.query()
    $scope.shipList = []

    $scope.filterData = {
      maxRank: 50,
      maxComponents: 61,
      minSurvaillance: 0,
      minRetrieval: 0,
      minSpeed: 0,
      minRange: 0,
      minFavor: 0
    }

    $scope.orderingField = 'minRank'
    $scope.orderingReverse = true

    $scope.orderBy = function (fieldName) {
      if ($scope.orderingField === fieldName) {
        $scope.orderingReverse = !$scope.orderingReverse
      } else {
        $scope.orderingField = fieldName
      }
    }

    function calculateShiplist(parts) {
      return $q(function(resolve, reject) {
        var shipList = []

        parts.filter(function (v) { return v.slot === 'Hull' }).forEach(function (hull) {
          parts.filter(function (v) { return v.slot === 'Rigging' }).forEach(function (rigging) {
            parts.filter(function (v) { return v.slot === 'Forecastle' }).forEach(function (forecastle) {
              parts.filter(function (v) { return v.slot === 'Aftercastle' }).forEach(function (aftercastle) {
                shipList.push({
                  name: hull.name + ', ' + rigging.name + ', ' + forecastle.name + ', ' + aftercastle.name,
                  minRank: Math.max(Number(hull.rank), Number(rigging.rank), Number(forecastle.rank), Number(aftercastle.rank)),
                  components: Number(hull.components) + Number(rigging.components) + Number(forecastle.components) + Number(aftercastle.components),
                  survaillance: Number(hull.survaillance) + Number(rigging.survaillance) + Number(forecastle.survaillance) + Number(aftercastle.survaillance),
                  retrieval: Number(hull.retrieval) + Number(rigging.retrieval) + Number(forecastle.retrieval) + Number(aftercastle.retrieval),
                  speed: Number(hull.speed) + Number(rigging.speed) + Number(forecastle.speed) + Number(aftercastle.speed),
                  range: Number(hull.range) + Number(rigging.range) + Number(forecastle.range) + Number(aftercastle.range),
                  favor: Number(hull.favor) + Number(rigging.favor) + Number(forecastle.favor) + Number(aftercastle.favor)
                })
              })
            })
          })
        })

        resolve(shipList)
      })
    }

    $scope.$watch('partList', function (newParts, oldParts) {
      calculateShiplist($scope.partList).then(function(ships) { $scope.shipList = ships })
    }, true)

    $scope.shipListFilter = function (ship) {
      if (Number(ship.minRank) > Number($scope.filterData.maxRank)) return false
      if (Number(ship.components) > Number($scope.filterData.maxComponents)) return false

      if (Number(ship.survaillance) < Number($scope.filterData.minSurvaillance)) return false
      if (Number(ship.retrieval) < Number($scope.filterData.minRetrieval)) return false
      if (Number(ship.speed) < Number($scope.filterData.minSpeed)) return false
      if (Number(ship.range) < Number($scope.filterData.minRange)) return false
      if (Number(ship.favor) < Number($scope.filterData.minFavor)) return false

      return true
    }

    $scope.newPart = function () {
      AirshipPart.create({name: 'newName'})
      .$promise.then(function (result) {
        $scope.partList = AirshipPart.query()
      })
    }

    $scope.deletePart = function (part) {
      AirshipPart.delete({id: part._id})
      .$promise.then(function (result) {
        $scope.partList = AirshipPart.query()
      })
    }

    $scope.updatePart = function (part) {
      AirshipPart.update({id: part._id}, part)
    }
  }
])
