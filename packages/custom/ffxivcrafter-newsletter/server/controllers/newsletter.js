'use strict'

var fs = require('fs')

var meanio = require('meanio')
var config = meanio.getConfig()

module.exports = function (io) {
  return {
    current: current
  }

  function current (req, res) {
    fs.readFile(config.newsletterStorageBase + '/current.pdf', function (err, data) {
      if(err) res.status(500).send(err)
      else res.send(data)
    })
  }
}
