'use strict'

var Q = require('q')
var httpreq = require('httpreq')

let nextRequestTime = Date.now()

var logger = require('log4js').getLogger('app.xivdb')

module.exports = function () {
  function getData (url) {
    var deferred = Q.defer()

    var now = Date.now()
    var delay = 0

    if (now > nextRequestTime) delay = 0
    else delay = nextRequestTime - now

    nextRequestTime = now + delay + 500

    Q.delay(delay)
    .then(function () {
      logger.info('sending import request for url ' + url)
      httpreq.get(url, function (err, xivdata) {
        if (err) {
          logger.error(err)
          deferred.reject(err)
        } else {
          var data

          try {
            data = JSON.parse(xivdata.body)
            logger.info(xivdata.body)
            deferred.resolve(data)
          } catch (err) {
            logger.error(err)
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
