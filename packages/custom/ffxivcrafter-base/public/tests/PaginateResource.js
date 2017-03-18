'use strict'

describe('PaginateResourceDirective', function () {
  beforeEach(module('mean.ffxivCrafter_base'))

  var $rootScope
  var $compile
  var $scope
  var $q
  var $resource
  var $httpBackend
  var _

  beforeEach(inject(function(_$httpBackend_, _$resource_, _$compile_, _$rootScope_, _$q_, ___){
    $httpBackend = _$httpBackend_
    $compile = _$compile_
    $rootScope = _$rootScope_
    $q = _$q_
    $scope = $rootScope.$new()
    _ = ___

    $resource = _$resource_
    $scope.mockResource = $resource('/api/mock/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      },
      count: {
        method: 'GET',
        url: '/api/mock/count'
      }
    })

    $scope.mockNoCountResource = $resource('/api/mock/:id',{id: '@id'},{
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST'
      }
    })

    var mockData = ['a', 'b', 'd']

    $httpBackend.whenRoute('GET', '/api/mock/count')
    .respond(function(method, url, data, headers, params) {
      return [200, {count: mockData.length }]
    })

    $httpBackend.whenRoute('GET', '/api/mock')
    .respond(function(method, url, data, headers, params) {
      return [200, _.slice(mockData, params.skip, params.skip + params.limit)]
    })

    jasmine.clock().install()
  }))

  afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation()
     $httpBackend.verifyNoOutstandingRequest()
     jasmine.clock().uninstall()
   })

  it('compiles', function (done) {
    var element = angular.element('<paginate-resource resource="mockResource" limit="10"></paginate>')
    var template = $compile(element)($scope)

    $scope.$digest()

    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    expect(controller.maxPages).toBeDefined()
    expect(controller.currentPage).toBeDefined()
    expect(controller.currentPage).toBe(0)
    done()
  })

  it('has 1 page, when number of elements is below the limit', function (done) {
    var element = angular.element('<paginate-resource resource="mockResource" limit="10"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()

    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    expect(controller.length).toBe(3)
    expect(controller.maxPages()).toBe(1)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(true)
    done()
  })

  it('has 2 page, when number of elements is above the limit', function (done) {
    var element = angular.element('<paginate-resource resource="mockResource" limit="2"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(true)
    expect(controller.onLastPage()).toBe(false)
    done()
  })

  it('calling nextPage moves to second Page when there is more then one page', function (done) {
    var element = angular.element('<paginate-resource resource="mockResource" limit="2"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    controller.nextPage()
    $httpBackend.flush()
    expect(controller.currentPage).toBe(1)
    expect(controller.maxPages()).toBe(2)
    expect(controller.onFirstPage()).toBe(false)
    expect(controller.onLastPage()).toBe(true)
    expect(controller.getPage().length).toBe(1)
    expect(controller.getPage()[0]).toBe('d')
    done()
  })

  it('calling prevPage after nextPage moves to first Page when there is more then one page', function (done) {
    var element = angular.element('<paginate-resource resource="mockResource" limit="2"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    controller.nextPage()
    $httpBackend.flush()
    controller.prevPage()
    $httpBackend.flush()
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
    var element = angular.element('<paginate-resource resource="mockResource" limit="10"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()
    var controller = element.controller('paginateResource')
    jasmine.clock().tick(10)
    $httpBackend.flush()
    controller.nextPage()
    $httpBackend.flush()
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

  it('throws an exception if no resource is given', function (done) {
    var element = angular.element('<paginate-resource limit="10"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()

    expect(function () { jasmine.clock().tick(10) }).toThrow()
    done()
  })

  it('throws an exception if resource without count is given', function (done) {
    var element = angular.element('<paginate-resource resource="mockNoCountResource" limit="10"></paginate>')
    var template = $compile(element)($scope)
    $scope.$digest()

    expect(function () { jasmine.clock().tick(10) }).toThrow()
    done()
  })
})
