'use strict'

var fs = require('fs')

var meanio = require('meanio')
var config = meanio.getConfig()

var formidable = require('formidable')

var mongoose = require('mongoose')
var Q = require('q')
mongoose.Promise = Q.Promise

var Newsletter = mongoose.model('Newsletter')

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

module.exports = function (io) {
  return {
    current: current,
    upload: upload,
    list: list,
    update: update
  }

  function list (req, res) {
    RestService.listAction(Newsletter, req, res)
  }

  function update (req, res) {
    Newsletter.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(function (newsletter) {
      io.emit('newsletter updated')
      res.send({})
    })
    .catch(function (err) {
      res.status(500).send(err)
    })
  }

  function current (req, res) {
    Newsletter.find({isCurrent: true})
    .exec()
    .then(function (newsletters) {
      if (newsletters.length === 0) res.status(500).send({error: 'no current newsletter found'})

      let newsletter = newsletters[0]
      let extension = 'pdf'
      let path = config.newsletterStorageBase + '/newsletter_' + newsletter._id + '.' + extension

      fs.readFile(path, function (err, data) {
        if (err) res.status(500).send(err)
        else res.send(data)
      })
    })
    .catch(function (err) {
      res.status(500).send(err)
    })
  }

  function upload (req, res) {
    var form = new formidable.IncomingForm()

    var newNewsletter = new Newsletter()
    newNewsletter.uploader = req.user._id
    newNewsletter.uploadDate = new Date()
    newNewsletter.format = 'pdf'

    let errorSend = false

    form.on('fileBegin', function (name, file) {
      // var splitType = _.split(file.type, '/')
      // if(splitType[0] != 'image') throw "Not an Image"
      // var extension = splitType[1]
      let extension = 'pdf'
      file.path = config.newsletterStorageBase + '/newsletter_' + newNewsletter._id + '.' + extension
    })

    form.on('file', function (name, file) {
      newNewsletter.save()
      .then(() => {
        io.emit('newsletter created')
      })
      .catch(function (err) {
        res.status(500).send(err)
        errorSend = true
      })
    })

    form.parse(req, function (err, fields, files) {
      if (err) {
        if(!errorSend) res.status(500).send(err)
      } else res.send({})
    })
  }
}
