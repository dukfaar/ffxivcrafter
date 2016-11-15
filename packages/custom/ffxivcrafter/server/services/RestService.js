'use strict'

var Q = require('q')

module.exports = function () {

  function list (mongooseFind, req) {
    var finalFind = req.query.populate ? mongooseFind.populate(req.query.populate) : mongooseFind

    return finalFind.lean().exec()
  }

  return {
    list: list
  }
}
