'use strict'

angular.module('mean.ffxivCrafter_calendar')
.directive('eventTicker', EventTickerDirective)

function EventTickerDirective () {
  return {
    controller: EventTickerController,
    controllerAs: 'eventTickerController',
    templateUrl: '/ffxivCrafter_calendar/views/eventTicker.html'
  }
}

EventTickerController.$inject = ['$scope', 'Event', '_', '$interval', 'socket']

function EventTickerController ($scope, Event, _, $interval, socket) {
  let vm = this
  this.events = []
  this.currentIndex = 0
  this.eventUnderway = eventUnderway

  fetchEvents()

  let tickerPromise = $interval(() => { vm.currentIndex = (vm.currentIndex + 1) % vm.events.length }, 5000)
  $scope.$on('$destroy', () => { $interval.cancel(tickerPromise) })

  function eventUnderway (event) { return event.start.getTime() < Date.now() }

  function fetchEvents () {
    Event.query({
      endFrom: new Date(),
      sort: 'start',
      limit: 5
    }).$promise.then((events) => {
      _.forEach(events, (event) => {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      })
      vm.events = events
    })
  }

  socket.auto('Event created', fetchEvents, $scope)
  socket.auto('Event updated', fetchEvents, $scope)
  socket.auto('Event deleted', fetchEvents, $scope)
}
