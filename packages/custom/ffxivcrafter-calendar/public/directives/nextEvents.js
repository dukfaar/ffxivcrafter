'use strict'

angular.module('mean.ffxivCrafter_calendar').directive('rcNextEvents', function () {
  return {
    templateUrl: '/ffxivCrafter_calendar/views/next.html',
    controller: NextEvents
  }
})

NextEvents.$inject = ['$scope', 'Event', '_']

function NextEvents ($scope, Event, _) {
  $scope.events = []

  $scope.eventUnderway = (event) => { return event.start.getTime() < Date.now() }

  Event.query({
    endFrom: new Date(),
    limit: 5
  }).$promise.then((events) => {
    _.forEach(events, (event) => {
      event.start = new Date(event.start)
      event.end = new Date(event.end)
    })
    $scope.events = events
  })
}
