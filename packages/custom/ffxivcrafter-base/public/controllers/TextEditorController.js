'use strict'

angular.module('mean.ffxivCrafter_base')
.controller('TextEditorController', TextEditorController)

TextEditorController.$inject = ['$scope', '$element', '_']

function TextEditorController ($scope, $element, _) {
  this.getText = getText
  this.setText = setText
  this.addURL = addUrl
  this.addImage = addImage
  this.injectTags = injectTags
  this.addBold = addBold
  this.addItalic = addItalic
  this.addUnderline = addUnderline

  /**
   * Inject tags into the editor textarea
   * @param  {[string]} tag tag that's supposed to be added
   * @return [void]
   */
  function injectTags (tag) {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    let text = getText()

    if (editorText.selectionStart === editorText.selectionEnd) {
      let before = text.substr(0, editorText.selectionStart)
      let after = text.substr(editorText.selectionStart, text.length)
      setText(before + '[' + tag + '][/' + tag + ']' + after)
    } else {
      let before = text.substr(0, editorText.selectionStart)
      let between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      let after = text.substr(editorText.selectionEnd)
      setText(before + '[' + tag + ']' + between + '[/' + tag + ']' + after)
    }
  }

  function addBold () {
    injectTags('b')
  }

  function addItalic () {
    injectTags('i')
  }

  function addUnderline () {
    injectTags('u')
  }

  function addUrl () {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    let text = getText()
    if (editorText.selectionStart === editorText.selectionEnd) {
      let before = text.substr(0, editorText.selectionStart)
      let after = text.substr(editorText.selectionStart, text.length)
      setText(before + '[' + 'a=URL' + '][/' + 'a' + ']' + after)
    } else {
      let before = text.substr(0, editorText.selectionStart)
      let between = text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart)
      let after = text.substr(editorText.selectionEnd)
      setText(before + '[' + 'a=URL' + ']' + between + '[/' + 'a' + ']' + after)
    }
  }

  function addImage () {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    let text = getText()
    if (editorText.selectionStart === editorText.selectionEnd) {
      let before = text.substr(0, editorText.selectionStart)
      let after = text.substr(editorText.selectionStart, text.length)
      setText(before + '[' + 'img=ID' + ']' + after)
    }
  }

  // TODO: allgemeine Lösung überlegen, funktioniert derzeit nur spezifisch für 2 Anwendungsfälle
  function getText () {
    if ($scope.$parent.data.text) return $scope.$parent.data.text
    else if ($scope.$parent.data.post) return $scope.$parent.data.post.text
    else throw new Error('Cannot get Text, please fix me')
  }

  // TODO: allgemeine Lösung überlegen, funktioniert derzeit nur spezifisch für 2 Anwendungsfälle
  function setText (text) {
    if ($scope.$parent.data.text) $scope.$parent.data.text = text
    else if ($scope.$parent.data.post) $scope.$parent.data.post.text = text
    else throw new Error('Cannot set Text, please fix me')
  }
}
