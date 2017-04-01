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
  this.addLeft = addLeft
  this.addCenter = addCenter
  this.addRight = addRight
  this.addColor = addColor
  this.addFontSize = addFontSize

  function doInjectTagInplace (before, tagOpen, tagClose, after) {
    setText(before + '[' + tagOpen + '][/' + tagClose + ']' + after)
  }

  function doInjectTagAround (before, tagOpen, between, tagClose, after) {
    setText(before + '[' + tagOpen + ']' + between + '[/' + tagClose + ']' + after)
  }

  /**
   * get the text from the editor textarea thats before and after the cursor
   * @param  {[type]} editorText textarea to use
   * @return [type]              Array with texts before and after the cursor
   */
  function getBeforeAfter (editorText) {
    let text = getText()
    return [
      text.substr(0, editorText.selectionStart),
      text.substr(editorText.selectionStart)
    ]
  }

  /**
   * get the texts before, between anf after the textarea thats before und after the selection, as well as the selection
   * @param  {[type]} editorText textarea to use
   * @return [type]              Array with texts before, between and after the cursor
   */
  function getBeforeBetweenAfter (editorText) {
    let text = getText()
    return [
      text.substr(0, editorText.selectionStart),
      text.substr(editorText.selectionStart, editorText.selectionEnd - editorText.selectionStart),
      text.substr(editorText.selectionEnd)
    ]
  }

  /**
   * Inject tags into the editor textarea
   * @param  {[string]} tag tag that's supposed to be added
   * @return [void]
   */
  function injectTags (tag) {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    if (editorText.selectionStart === editorText.selectionEnd) {
      let [before, after] = getBeforeAfter(editorText)
      doInjectTagInplace(before, tag, tag, after)
    } else {
      let [before, between, after] = getBeforeBetweenAfter(editorText)
      doInjectTagAround(before, tag, between, tag, after)
    }
  }

  /**
   * Inject tags with a paramater into the editor textarea
   * @param  {[string]} tag tag that's supposed to be added
   * @param  {[string]} param Name of the paramater
   * @return [void]
   */
  function injectParameterTags (tag, param) {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    if (editorText.selectionStart === editorText.selectionEnd) {
      let [before, after] = getBeforeAfter(editorText)
      doInjectTagInplace(before, tag + '=' + param, tag, after)
    } else {
      let [before, between, after] = getBeforeBetweenAfter(editorText)
      doInjectTagAround(before, tag + '=' + param, between, tag, after)
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

  function addLeft () {
    injectTags('left')
  }

  function addCenter () {
    injectTags('center')
  }

  function addRight () {
    injectTags('right')
  }

  function addUrl () {
    injectParameterTags('a', 'URL')
  }

  function addColor () {
    injectParameterTags('color', 'COLOR')
  }

  function addFontSize () {
    injectParameterTags('font-size', 'SIZE')
  }

  function addImage () {
    let editorText = _.filter($element.find('textarea'), el => el.classList.contains('editorText'))[0]
    if (editorText.selectionStart === editorText.selectionEnd) {
      let [before, after] = getBeforeAfter(editorText)
      setText(before + '[' + 'img=ID' + ']' + after)
    }
  }

  // TODO: allgemeine Lösung überlegen, funktioniert derzeit nur spezifisch für 2 Anwendungsfälle
  function getText () {
    if ($scope.$parent.data && $scope.$parent.data.text) return $scope.$parent.data.text
    else if ($scope.$parent.data && $scope.$parent.data.post) return $scope.$parent.data.post.text
    else if ($scope.$parent.$parent.adminNewsController) return $scope.$parent.$parent.adminNewsController.newsResource.text
    else throw new Error('Cannot get Text, please fix me')
  }

  // TODO: allgemeine Lösung überlegen, funktioniert derzeit nur spezifisch für 2 Anwendungsfälle
  function setText (text) {
    if ($scope.$parent.data && $scope.$parent.data.text) $scope.$parent.data.text = text
    else if ($scope.$parent.data && $scope.$parent.data.post) $scope.$parent.data.post.text = text
    else if ($scope.$parent.$parent.adminNewsController) $scope.$parent.$parent.adminNewsController.newsResource.text = text
    else throw new Error('Cannot set Text, please fix me')
  }
}
