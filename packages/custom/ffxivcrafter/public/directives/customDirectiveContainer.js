'use strict'

angular.module('mean.ffxivCrafter').directive('rcCustomDirectiveContainer', function ($compile, localStorageService, _, $timeout) {
  var storageName = ''
  var directiveScope = null
  var directiveElement = null

  function clearDirectives () {
    $('.' + storageName).remove()
  }

  function addDirectives () {
    clearDirectives()

    var directives = localStorageService.get(storageName)
    directives = _.filter(directives, function (directive) {
      return (typeof directive === 'object')
    })
    localStorageService.set(storageName, directives)

    directives.forEach(function (directive, index) {
      var paramsString = ''

      if(directive.params) {
        paramsString = _.join(_.map(directive.params, function (value, key) { return key + '="' + value + '"' }), ' ')
      }

      var newElement = $compile('<' + directive.name + ' id="' + storageName + '_' + index + '" ' + paramsString + ' class="' + storageName + '"></' + directive.name + '>')(directiveScope)
      directiveElement.append(newElement)
    })

    $timeout(function () {
      directives.forEach(function (directive, index) {
        var id = '#' + storageName + '_' + index
        var toolbar = $(id + ' md-toolbar .md-toolbar-tools')

        var deleteElement = $compile('<md-button class="md-icon-button" ng-click="removeDirective(' + index + ')"><md-icon class="material-icons">delete</md-icon></md-button>')(directiveScope)
        toolbar.append(deleteElement)
      })
    }, 2000, false)
  }

  function addDirective (directive) {
    var directives = localStorageService.get(storageName)
    directives.push(directive)
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
    link: function (scope, element, attrs, ctrl) {
      directiveScope = scope
      directiveElement = element
      storageName = attrs.rcCustomDirectiveContainer
      ctrl.allowedDirectives = scope.$eval(attrs.rcAllowedDirectives)

      scope.removeDirective = removeDirective

      if(!localStorageService.get(storageName)) localStorageService.set(storageName, [])

      element.append($compile('<custom-directive-container-adder></custom-directive-container-adder>')(scope))

      addDirectives()
    },
    controller: function ($scope) {
      this.addDirective = addDirective
      this.removeDirective = removeDirective
    }
  }
})
