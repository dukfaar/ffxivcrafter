'use strict'

angular.module('mean.ffxivCrafter_calendar')
.directive('eventCalendar', function () {
  return {
    templateUrl: '/ffxivCrafter_calendar/views/calendar.html',
    controller: CalendarController
  }
})

CalendarController.$inject = ['$scope', '$http', '$mdDialog', '_', '$mdMedia', 'Event', 'UserService', 'socket']

function CalendarController ($scope, $http, $mdDialog, _, $mdMedia, Event, UserService, socket) {
  $scope.UserService = UserService

  $scope._ = _

  $scope.events = [ ]

  $scope.now = new Date()

  $scope.refetchEventData = refetchEventData
  $scope.setCalendarMonth = setCalendarMonth

  $scope.calendarData = {
    currentMonth: 0,
    currentYear: 0,
    daysInMonth: 0,
    skipDays: 0,
    days: []
  }

  function triggerEventRefresh () { $scope.refetchEventData() }

  socket.on('event created', triggerEventRefresh)
  socket.on('event updated', triggerEventRefresh)
  socket.on('event deleted', triggerEventRefresh)

  $scope.$on('destroy', function () {
    socket.off('event created', triggerEventRefresh)
    socket.off('event updated', triggerEventRefresh)
    socket.off('event deleted', triggerEventRefresh)
  })

  $scope.addEmptyTiles = function () {
    return $mdMedia('gt-sm')
  }

  $scope.openEventView = function (event) {
    $mdDialog.show({
      templateUrl: 'ffxivCrafter_calendar/views/viewEventDialog.html',
      parent: angular.element(document.body),
      locals: {
        data: event
      },
      controller: function ($scope, data) {
        $scope.data = data

        $scope.hide = function () {
          $mdDialog.hide()
        }
        $scope.cancel = function () {
          $mdDialog.cancel()
        }
      },
      clickOutsideToClose: true
    }).then(function (result) {
    })
  }

  $scope.createNewEvent = function () {
    $mdDialog.show({
      templateUrl: 'ffxivCrafter_calendar/views/newEventDialog.html',
      parent: angular.element(document.body),
      controller: function ($scope) {
        $scope.data = {
          title: '',
          description: '',
          start: new Date(),
          end: new Date()
        }

        $scope.hide = function () {
          $mdDialog.hide()
        }
        $scope.cancel = function () {
          $mdDialog.cancel()
        }
        $scope.save = function () {
          $mdDialog.hide($scope.data)
        }
      },
      clickOutsideToClose: true
    }).then(function (result) {
      $scope.doCreateNewEvent(result)
    })
  }

  $scope.doCreateNewEvent = function (data) {
    var newEvent = new Event(data)
    newEvent.$save()
  }

  function buildCalendarDays () {
    var newDays = []

    for (var i = 0; i < $scope.calendarData.daysInMonth; i++) {
      newDays[i] = {
        day: i + 1,
        events: []
      }
    }

    _.forEach($scope.events, function (event) {
      if ($scope.calendarData.currentMonth - 1 === event.start.getMonth() && $scope.calendarData.currentYear === event.start.getFullYear()) {
        newDays[event.start.getDate() - 1].events.push(event)
      }
    })

    $scope.calendarData.days = newDays
  }

  function setCalendarMonth (month, year) {
    $scope.calendarData.currentMonth = month
    $scope.calendarData.currentYear = year

    if ($scope.calendarData.currentMonth === 0) {
      $scope.calendarData.currentYear--
      $scope.calendarData.currentMonth = 12
    } else if ($scope.calendarData.currentMonth === 13) {
      $scope.calendarData.currentYear++
      $scope.calendarData.currentMonth = 1
    }

    $scope.calendarData.daysInMonth = new Date($scope.calendarData.currentYear, $scope.calendarData.currentMonth, 0).getDate()
    $scope.calendarData.skipDays = new Date($scope.calendarData.currentYear, $scope.calendarData.currentMonth - 1, 1).getDay()

    $scope.events = Event.query({
      startFrom: new Date($scope.calendarData.currentYear, $scope.calendarData.currentMonth - 1, 1),
      startTo: new Date($scope.calendarData.currentYear, $scope.calendarData.currentMonth, 1)
    })
    $scope.events.$promise.then(function () {
      _.forEach($scope.events, function (event) {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
      })
      buildCalendarDays()
    })
  }


  setCalendarMonth($scope.now.getMonth() + 1, $scope.now.getFullYear())

  $scope.prevMonth = function () {
    setCalendarMonth($scope.calendarData.currentMonth - 1, $scope.calendarData.currentYear)
  }

  $scope.nextMonth = function () {
    setCalendarMonth($scope.calendarData.currentMonth + 1, $scope.calendarData.currentYear)
  }

  function refetchEventData () {
    setCalendarMonth($scope.calendarData.currentMonth, $scope.calendarData.currentYear)
  }
}
