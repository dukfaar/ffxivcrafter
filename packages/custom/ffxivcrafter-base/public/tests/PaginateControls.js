'use strict'

describe('PaginateControlsDirective', function () {
  beforeEach(module('mean.ffxivCrafter_base'))
  beforeEach(angular.mock.module('ngMockE2E'))

  var $rootScope
  var $compile
  var $scope

  beforeEach(inject(function(_$compile_, _$rootScope_, $httpBackend){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new()

    $httpBackend.whenGET(/.*/).passThrough()
  }))

  afterEach(function() {
  })

  it('compiles', function (done) {
    var element = angular.element('<paginate-controls page-buttons="2"></paginate-controls>')
    var template = $compile(element)($scope)
    $scope.$digest()
    done()
  })

  it('has buttons of correct amounts', function (done) {
    var element = angular.element('<paginate-controls page-buttons="2"></paginate-controls>')
    var template = $compile(element)($scope)

    $scope.$digest()
    setTimeout(function() {
      var controller = element.controller('paginateControls')

      expect(controller.getPageArray(5, 10).length).toBe(5)
      done()
    },50)
  })

  it('has buttons of correct amounts', function (done) {
    var element = angular.element('<paginate-controls page-buttons="2"></paginate-controls>')
    var template = $compile(element)($scope)

    $scope.$digest()
    setTimeout(function() {
      var controller = element.controller('paginateControls')

      expect(controller.getPageArray(0, 10).length).toBe(3)
      done()
    },50)
  })

  it('has buttons of correct amounts', function (done) {
    var element = angular.element('<paginate-controls page-buttons="2"></paginate-controls>')
    var template = $compile(element)($scope)

    $scope.$digest()
    setTimeout(function() {
      var controller = element.controller('paginateControls')

      expect(controller.getPageArray(9, 10).length).toBe(3)
      done()
    },50)
  })

})
