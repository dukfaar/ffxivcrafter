'use strict'

angular.module('mean.ffxivCrafter_base').controller('TextEditorController', TextEditorController)

TextEditorController.$inject = ['$scope', '$element', '_']

function TextEditorController ($scope, $element, _) {
  //TODO: allgemeine Lösung überlegen, funktioniert derzeit nur spezifisch für 2 Anwendungsfälle
  this.getText = function () {
    if($scope.$parent.data.text) return $scope.$parent.data.text
    else if($scope.$parent.data.post) return $scope.$parent.data.post.text
    else throw "Cannot get Text, please fix me"
  }

  this.setText = function (text) {
    if($scope.$parent.data.text) $scope.$parent.data.text = text
    else if($scope.$parent.data.post) $scope.$parent.data.post.text = text
    else throw "Cannot set Text, please fix me"
  }

  this.injectTags = function (tag) {
    var editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    var text = this.getText()

    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      this.setText(before + '[' + tag + '][/' + tag + ']' + after)
    } else {
      var before = text.substr(0, editorText.selectionStart)
      var between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      var after = text.substr(editorText.selectionEnd)
      this.setText(before + '[' + tag + ']' + between + '[/'+ tag + ']' + after)
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
    var text = this.getText()
    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      this.setText(before + '[' + 'a=URL' + '][/' + 'a' + ']' + after)
    } else {
      var before = text.substr(0, editorText.selectionStart)
      var between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      var after = text.substr(editorText.selectionEnd)
      this.setText(before + '[' + 'a=URL' + ']' + between + '[/'+ 'a' + ']' + after)
    }
  }

  this.addImage = function () {
    var editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    var text = this.getText()
    if(editorText.selectionStart === editorText.selectionEnd) {
      var before = text.substr(0, editorText.selectionStart)
      var after = text.substr(editorText.selectionStart, text.length)
      this.setText(before + '[' + 'img=ID' + ']' + after)
    }
  }
}
