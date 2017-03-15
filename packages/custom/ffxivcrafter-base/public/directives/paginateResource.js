'use strict'

angular.module('mean.ffxivCrafter_base').directive('paginateResource', function () {
  return {
    controller: PaginateResourceController,
    controllerAs: 'paginateController',
    bindToController: {
      limit: '=',
      resource: '='
    },
    scope: true
  }
})

PaginateResourceController.$inject = ['_', '$q']

function PaginateResourceController (_, $q) {
  this.length = 0
  this.currentPage = 0
  this.list = []

  this.fetchingLength = false
  this.fetchingList = false

  this.fetchLength = function () {
    if(!this.resource) throw "Resource not defined"
    if(!this.resource.count) throw "Resource does not have a count method; please implement"

    if(this.fetchingLength) return $q.when()

    this.fetchingLength = true
    return this.resource.count().$promise
    .then((result) => {
      this.length = result.count
      this.fetchingLength = false
    })
    .catch((err) => {
      this.fetchingLength = false
    })
  }

  this.maxPages = function () {
    return Math.ceil(this.length / this.limit)
  }

  this.getStart = function() {
    return this.currentPage * this.limit
  }

  this.onLastPage = function() {
    return this.currentPage === (this.maxPages() - 1)
  }

  this.onFirstPage = function () {
    return this.currentPage === 0
  }

  this.fetchList = function () {
    if(this.fetchingList) return $q.when()

    this.fetchingList = true

    var q = this.resource.query({skip: this.getStart(), limit: this.limit})

    return q.$promise.then((result) => {
      this.list = result
      this.fetchingList = false
    })
    .catch(() => {
      this.fetchingList = false
    })
  }

  this.toPage = function (toPage) {
    this.currentPage = _.clamp(toPage, 0, this.maxPages() - 1)
    this.fetchList()
  }

  this.nextPage = function () {
    this.toPage(this.currentPage + 1)
  }

  this.prevPage = function () {
    this.toPage(this.currentPage - 1)
  }

  this.getPage = function () {
    return this.list
  }

  this.triggerRefetch = function () {
    this.fetchLength()
    .then(function() {
      this.toPage(this.currentPage)
    }.bind(this))
  }

  //timeout is needed because the resource objects seems to get initialized later
  setTimeout(function() {
    this.fetchLength()
    .then(function () { this.toPage(0) }.bind(this))
  }.bind(this), 0)
}
