'use strict'

angular.module('mean.ffxivCrafter').directive('customDirectiveContainer', function ($compile, localStorageService, _, $timeout) {
  var storageName = ''
  var directiveScope = null
  var directiveElement = null

  function clearDirectives () {
    $('.' + storageName).remove()
  }

  function addDirectives () {
    clearDirectives()

    var directives = localStorageService.get(storageName)
    directives.forEach(function (directiveName, index) {
      var newElement = $compile('<' + directiveName + ' id="' + storageName + '_' + index + '" log="filteredLog" class="' + storageName + '"></' + directiveName + '>')(directiveScope)
      directiveElement.append(newElement)
    })

    $timeout(function () {
      directives.forEach(function (directiveName, index) {
        var id = '#' + storageName + '_' + index
        var toolbar = $(id + ' md-toolbar .md-toolbar-tools')

        var deleteElement = $compile('<md-button class="md-icon-button" ng-click="removeDirective(' + index + ')"><md-icon class="material-icons">delete</md-icon></md-button>')(directiveScope)
        toolbar.append(deleteElement)
      })
    }, 200, false)
  }

  function addDirective (directiveName) {
    var directives = localStorageService.get(storageName)
    directives.push(directiveName)
    localStorageService.set(storageName, directives)

    addDirectives()
  }

  function removeDirective (index) {
    var directives = localStorageService.get(storageName)
    directives.splice(index, 1)
    localStorageService.set(storageName, directives)

    addDirectives()
  }

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      directiveScope = scope
      directiveElement = element
      storageName = attrs.customDirectiveContainer
      scope.removeDirective = removeDirective

      if(!localStorageService.get(storageName)) localStorageService.set(storageName, [])

      element.append($compile('<custom-directive-container-adder></custom-directive-container-adder>')(scope))

      addDirectives()
    },
    controller: function ($scope) {
      this.addDirective = addDirective
      this.removeDirective = removeDirective

      this.allowedDirectives = [
        {title: 'Activity', name: 'reporting-activity-chart'},
        {title: 'User Activity', name: 'reporting-user-activity-chart'},
        {title: 'Day of the Week Activity', name: 'reporting-dow-activity-chart'},
        {title: 'Time of Day Activity', name: 'reporting-tod-activity-chart'},
        {title: 'User Contribution', name: 'reporting-user-contribution-chart'},
        {title: 'Involved Items', name: 'reporting-involved-items'}
      ]
    }
  }
})
