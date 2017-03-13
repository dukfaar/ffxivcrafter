'use strict'

var fs = require('fs')
var mongoose = require('mongoose')
var Q = require('q')
mongoose.Promise = Q.Promise

var meanio = require('meanio')
var config = meanio.getConfig()

var Image = mongoose.model('Image')

var RestService = require('../../../ffxivcrafter/server/services/RestService')()

var formidable = require('formidable')

var _ = require('lodash')

module.exports = function (io) {
  return {
    list: function (req, res) {
      RestService.list(Image.find({}), req)
      .then(function(result) {
        res.send(result)
      })
      .catch(function(error) {
        res.status(500).send(error)
      })
    },
    create: function (req, res) {
      var form = new formidable.IncomingForm()

      var newImage = new Image()
      newImage.uploader = req.user._id
      newImage.uploadDate = new Date()
      newImage.save()
      .then(() => {
        form.on('fileBegin', function (name, file){
          file.path = config.imageStorageBase + '/image_' + newImage._id + '.png'
        })

        form.on('file', function (name, file){
          io.emit('image created')
        })

        form.parse(req, function(err, fields, files) {
          res.send({})
        })
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    get: function (req, res) {
      RestService.populateFind(Image.findById(req.params.id), req).exec()
      .then(function (instance) {
        res.send(instance)
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    getImageData: function (req, res) {
      fs.readFile(config.imageStorageBase + '/image_' + req.params.id + '.png', function(err, data) {
        if(err) res.status(500).send(err)
        else res.send(data)
      })
    },
    update: function (req, res) {
      Image.findByIdAndUpdate(req.params.id, req.body).exec()
      .then(function (part) {
        io.emit('image updated')
        res.send({})
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    },
    delete: function (req, res) {
      Image.findByIdAndRemove(req.params.id).exec()
      .then(function () {
        fs.unlink(config.imageStorageBase + '/image_' + req.params.id + '.png', function (err) {
          if(err) {
            res.status(500).send(err)
          } else {
            io.emit('image deleted')
            res.send({})
          }
        })
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    }
  }
}
