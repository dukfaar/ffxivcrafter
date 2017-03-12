'use strict'

angular.module('mean.ffxivCrafter_base').controller('TextEditorController', TextEditorController)

TextEditorController.$inject = ['$scope', '$element', '_']

function TextEditorController ($scope, $element, _) {
  this.injectTags = function (tag) {
    var editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    var text = $scope.$parent.data.text
    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      $scope.$parent.data.text = before + '[' + tag + '][/' + tag + ']' + after
    } else {
      var before = text.substr(0, editorText.selectionStart)
      var between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      var after = text.substr(editorText.selectionEnd)
      $scope.$parent.data.text = before + '[' + tag + ']' + between + '[/'+ tag + ']' + after
    }
  }

  this.addBold = function () {
    this.injectTags('b')
  }

  this.addItalic = function () {
    this.injectTags('i')
  }

  this.addUnderline = function () {
    this.injectTags('u')
  }

  this.addURL = function () {
    var editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    var text = $scope.$parent.data.text
    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      $scope.$parent.data.text = before + '[' + 'a=URL' + '][/' + 'a' + ']' + after
    } else {
      var before = text.substr(0, editorText.selectionStart)
      var between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      var after = text.substr(editorText.selectionEnd)
      $scope.$parent.data.text = before + '[' + 'a=URL' + ']' + between + '[/'+ 'a' + ']' + after
    }
  }

  this.addImage = function () {
    var editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    var text = $scope.$parent.data.text
    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      $scope.$parent.data.text = before + '[' + 'img=ID' + ']' + after
    }
  }
}
