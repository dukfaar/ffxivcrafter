'use strict'

var mongoose = require('mongoose')
var User = mongoose.model('User')


module.exports = function () {

  return {
    list: function (req, res) {
      User.find({}).exec(function(err,result) {
        if(err) {
          res.render('error', {
            status: 500
          })
        }
        res.send(result)
      })
    }
  }
}
