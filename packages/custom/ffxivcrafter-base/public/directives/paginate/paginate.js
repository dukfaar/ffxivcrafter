'use strict'

angular.module('mean.ffxivCrafter_base').directive('paginate', function () {
  return {
    controller: PaginateController,
    controllerAs: 'paginateController',
    bindToController: {
      list: '=',
      limit: '='
    },
    scope: true
  }
})

PaginateController.$inject = ['_']

function PaginateController (_) {
  this.currentPage = 0

  this.getListLength = function () {
    return (this.list) ? this.list.length : 0
  }

  this.maxPages = function () {
    return Math.ceil(this.getListLength() / this.limit)
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

  this.toPage = function (toPage) {
    this.currentPage = _.clamp(toPage, 0, this.maxPages() - 1)
  }

  this.nextPage = function () {
    this.toPage(this.currentPage + 1)
  }

  this.prevPage = function () {
    this.toPage(this.currentPage - 1)
  }

  this.getPage = function () {
    return _.slice(this.list, this.getStart(), this.getStart() + this.limit)
  }
}
