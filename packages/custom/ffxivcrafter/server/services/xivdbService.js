'use strict'

var Q = require('q')
var _ = require('lodash')
var httpreq = require('httpreq')

let nextRequestTime = Date.now()

module.exports = function () {
  function getData (url) {
    var deferred = Q.defer()

    var now = Date.now()
    var delay = 0

    if(now > nextRequestTime) delay = 0
    else delay = nextRequestTime - now

    nextRequestTime = now + delay + 100

    Q.delay(delay)
    .then(function () {
      httpreq.get(url, function (err, xivdata) {
        if (err) {
          deferred.reject(err)
        } else {
          var data

          try {
            data = JSON.parse(xivdata.body)
            deferred.resolve(data)
          } catch (err) {
            deferred.reject(err)
          }
        }
      })
    })

    return deferred.promise
  }


  return {
    getData: getData
  }
}
