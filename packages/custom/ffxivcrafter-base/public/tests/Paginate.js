'use strict'

describe('PaginateDirective', function () {
  beforeEach(module('mean.ffxivCrafter_base'))

  var $rootScope
  var $compile
  var $scope

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new()
  }))

  it('compiles', function (done) {
    var element = angular.element('<paginate list="testList" limit="10"></paginate>')
    $scope.testList = ['a', 'b', 'd', 'c']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    expect(controller.maxPages).toBeDefined()
    expect(controller.currentPage).toBeDefined()
    expect(controller.currentPage).toBe(0)
    done()
  })

  it('has 1 page, when number of elements is below the limit', function (done) {
    var element = angular.element('<paginate list="testList" limit="10"></paginate>')
    $scope.testList = ['a', 'b', 'd', 'c']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    expect(controller.maxPages()).toBe(1)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(true)
    done()
  })

  it('has 2 page, when number of elements is above the limit', function (done) {
    var element = angular.element('<paginate list="testList" limit="2"></paginate>')
    $scope.testList = ['a', 'b', 'd', 'c']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(false)
    done()
  })

  it('has 2 page, when number of elements is just above the limit', function (done) {
    var element = angular.element('<paginate list="testList" limit="2"></paginate>')
    $scope.testList = ['a', 'b', 'd']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(false)
    done()
  })

  it('calling nextPage moves to second Page when there is more then one page', function (done) {
    var element = angular.element('<paginate list="testList" limit="2"></paginate>')
    $scope.testList = ['a', 'b', 'd']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    controller.nextPage()
    expect(controller.currentPage).toBe(1)
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(false)
    expect(controller.onLastPage()).toBe(true)
    expect(controller.getPage().length).toBe(1)
    expect(controller.getPage()[0]).toBe('d')
    done()
  })

  it('calling prevPage after nextPage moves to first Page when there is more then one page', function (done) {
    var element = angular.element('<paginate list="testList" limit="2"></paginate>')
    $scope.testList = ['a', 'b', 'd']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    controller.nextPage()
    controller.prevPage()
    expect(controller.currentPage).toBe(0)
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(false)
    expect(controller.getPage().length).toBe(2)
    expect(controller.getPage()[0]).toBe('a')
    expect(controller.getPage()[1]).toBe('b')
    done()
  })

  it('calling nextPage stays on page one when there is only one page', function (done) {
    var element = angular.element('<paginate list="testList" limit="10"></paginate>')
    $scope.testList = ['a', 'b', 'd']
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginate')
    controller.nextPage()
    expect(controller.currentPage).toBe(0)
    expect(controller.maxPages()).toBe(1)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(true)
    expect(controller.getPage().length).toBe(3)
    expect(controller.getPage()[0]).toBe('a')
    expect(controller.getPage()[1]).toBe('b')
    expect(controller.getPage()[2]).toBe('d')
    done()
  })
})
