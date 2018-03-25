'use strict'

/*
var cl = console.log
console.log = function(){
  console.trace()
  cl.apply(console,arguments)
}
*/

process.env.NODE_CONFIG_DIR = './config/env'

// Requires meanio .
var mean = require('meanio')
var cluster = require('cluster')
var deferred = require('q').defer()
var debug = require('debug')('cluster')


var workerId = 0
mean.serve({ workerid: workerId }, function (app) {
  var config = app.getConfig()
  var port = config.https && config.https.port ? config.https.port : config.http.port
  debug(`MEAN app started on port ${port} (${process.env.NODE_ENV}) with cluster worker id ${workerId}`)
  deferred.resolve(app)
})

module.exports = deferred.promise
