'use strict'

angular.module('mean.ffxivCrafter').filter('kanbanText', function ($sce, _) {
  return function(inputText) {
    var resultText = inputText

    resultText = _.replace(resultText, /</g, '&lt;')
    resultText = _.replace(resultText, />/g, '&gt;')

    resultText = _.replace(resultText, /\[table\]\s*([\s\S]*?)\s*\[\/table\]/g, function (match, p1, offset, string) {
      var tableBodyContent = p1
      tableBodyContent = _.replace(tableBodyContent, /\|/g, '</td><td>')
      tableBodyContent = _.replace(tableBodyContent, /\\\\\n\s*/g, '</td></tr><tr><td>')

      return '<table><tr><td>' + tableBodyContent + '</td></tr></table>'
    })

    var price = 0
    var cc = 0

    resultText = _.replace(resultText, /\[price\s*=\s*(\d+\.?\d*)\]/g, function(match, p1, offset, string) {
      var value = Number.parseFloat(p1)
      price = value

      return value.toLocaleString()
    })

    resultText = _.replace(resultText, /\[cc\s*\+\s*(\d+\.?\d*)\]/g, function(match, p1, offset, string) {
      var value = Number.parseFloat(p1)
      cc += value

      return value.toLocaleString()
    })

    resultText = _.replace(resultText, /\[portion\s*=\s*(\d+\.?\d*)\]/g, function(match, p1, offset, string) {
      var value = Number.parseFloat(p1)
      var portion = (price - cc) * (value / 100)

      return portion.toLocaleString()
    })

    resultText = _.replace(resultText, /\[project:(\w+)\:(.*)\]/g, '<a href="/project/list/$1">$2</a>')
    return $sce.trustAsHtml(resultText)
  }
})
