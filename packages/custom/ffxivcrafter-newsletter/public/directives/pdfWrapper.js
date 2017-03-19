'use strict'

angular.module('mean.ffxivCrafter')
.directive('pdfWrapper', PdfWrapperDirective)

function PdfWrapperDirective () {
  return {
    controller: PdfWrapperController,
    controllerAs: 'pdfWrapperController',
    link: function (scope, element, attrs, controller, transcludeFn) {
      controller.element = element[0]
    }
  }
}

PdfWrapperController.$inject = []

function PdfWrapperController () {
}
