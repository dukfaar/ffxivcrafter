'use strict'

angular.module('mean.ffxivCrafter').filter('kanbanText', function ($sce, _) {
  return function (inputText) {
    var resultText = inputText

    resultText = _.replace(resultText, /</g, '&lt;')
    resultText = _.replace(resultText, />/g, '&gt;')

    let tagsToConvertDirectly = ['b', 'i', 'u']
    let tagsToMapWithParam = {
      'left': { tag: 'div', param: 'style="text-align:left;"' },
      'center': { tag: 'div', param: 'style="text-align:center;"' },
      'right': { tag: 'div', param: 'style="text-align:right;"' },
      'project': { tag: 'a', param: p => 'href="/project/view/' + p + '"' },
      'fcategory': { tag: 'a', param: p => 'href="/forum/category/' + p + '"' },
      'fthread': { tag: 'a', param: p => 'href="/forum/thread/' + p + '"' },
      'a': { tag: 'a', param: p => 'target="_blank" href="' + p + '"' },
      'color': { tag: 'span', param: color => 'style="color: ' + color + ';"' },
      'font-size': { tag: 'span', param: color => 'style="font-size: ' + color + ';"' }
    }

    _.forEach(tagsToConvertDirectly, (tag) => {
      resultText = _.replace(resultText, new RegExp('\\[' + tag + '\\]', 'g'), '<' + tag + '>')
      resultText = _.replace(resultText, new RegExp('\\[/' + tag + '\\]', 'g'), '</' + tag + '>')
    })

    _.forEach(tagsToMapWithParam, (value, key) => {
      resultText = _.replace(resultText, new RegExp('\\[' + key + '(\\s*=\\s*([\\S]*?))?\\]', 'g'), function (match, p1, p2, offset, string) {
        let paramText = null
        if (_.isFunction(value.param)) {
          paramText = value.param(p2)
        } else {
          paramText = value.param
        }
        return '<' + value.tag + ' ' + paramText + '>'
      })
      resultText = _.replace(resultText, new RegExp('\\[/' + key + '\\]', 'g'), '</' + value.tag + '>')
    })

    resultText = _.replace(resultText, /\[table\]\s*([\s\S]*?)\s*\[\/table\]/g, function (match, p1, offset, string) {
      var tableBodyContent = p1
      tableBodyContent = _.replace(tableBodyContent, /\|/g, '</td><td>')
      tableBodyContent = _.replace(tableBodyContent, /\\\\\n\s*/g, '</td></tr><tr><td>')

      return '<table><tr><td>' + tableBodyContent + '</td></tr></table>'
    })

    /* resultText = _.replace(resultText, /\[a\s*=\s*([\s\S]*)\]([\s\S]*?)\[\/a\]/g, function (match, p1, p2, offset, string) {
      return '<a target="_blank" href=\"' + p1 + '\">' + p2 + '</a>'
    }) */

    resultText = _.replace(resultText, /\[img\s*=\s*(\w*)\]/g, function (match, p1, offset, string) {
      var id = p1

      return '<img style="max-width:100%" src="/api/imageData/' + id + '"/>'
    })

    var price = 0
    var cc = 0

    resultText = _.replace(resultText, /\[price\s*=\s*(\d+\.?\d*)\]/g, function (match, p1, offset, string) {
      var value = Number.parseFloat(p1)
      price = value

      return value.toLocaleString()
    })

    resultText = _.replace(resultText, /\[cc\s*\+\s*(\d+\.?\d*)\]/g, function (match, p1, offset, string) {
      var value = Number.parseFloat(p1)
      cc += value

      return value.toLocaleString()
    })

    resultText = _.replace(resultText, /\[portion\s*=\s*(\d+\.?\d*)(:(\w+))?\]/g, function (match, p1, p2, p3, offset, string) {
      var value = Number.parseFloat(p1)
      var portion = (price - cc) * (value / 100)

      return portion.toLocaleString()
    })

    resultText = _.replace(resultText, /\[project:(\w+)\:(.*)\]/g, '<a href="/project/view/$1">$2</a>')
    return $sce.trustAsHtml(resultText)
  }
})
