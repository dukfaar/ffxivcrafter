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

var sharp = require('sharp')

var _ = require('lodash')

module.exports = function (io) {

  function modifyQuery (query) {
    if(query.tags) {
      query.tags = { $regex: new RegExp(query.tags, "i") }
    }
    return query
  }

  return {
    list: function (req, res) {
      console.log(req.query)
      modifyQuery(req.query)
      console.log(req.query)

      RestService.listAction(Image, req, res)
    },
    count: function (req, res) {
      console.log(req.query)
      modifyQuery(req.query)
      console.log(req.query)

      RestService.countAction(Image, req, res)
    },
    create: function (req, res) {
      var form = new formidable.IncomingForm()

      var newImage = new Image()
      newImage.uploader = req.user._id
      newImage.uploadDate = new Date()

      form.on('fileBegin', function (name, file) {
        var splitType = _.split(file.type, '/')
        if(splitType[0] != 'image') throw "Not an Image"
        var extension = splitType[1]
        file.path = config.imageStorageBase + '/image_upload_' + newImage._id + '.' + extension
      })

      form.on('file', function (name, file) {
        Q.all([
          sharp(file.path)
            .toFile(config.imageStorageBase + '/image_' + newImage._id + '.jpg'),

          sharp(file.path)
            .resize(200, 200)
            .max()
            .toFile(config.imageStorageBase + '/image_thumbnail_' + newImage._id + '.jpg')
        ]).then(function () {
          fs.unlink(file.path, function (err) {
            newImage.save()
            .then(() => {
              io.emit('image created')
            })
          })
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      })

      form.parse(req, function(err, fields, files) {
        res.send({})
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
      fs.readFile(config.imageStorageBase + '/image_' + req.params.id + '.jpg', function(err, data) {
        if(err) res.status(500).send(err)
        else res.send(data)
      })
    },
    getImageThumbnailData: function (req, res) {
      fs.readFile(config.imageStorageBase + '/image_thumbnail_' + req.params.id + '.jpg', function(err, data) {
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
        fs.unlink(config.imageStorageBase + '/image_thumbnail_' + req.params.id + '.jpg', function (err) {
        })

        fs.unlink(config.imageStorageBase + '/image_' + req.params.id + '.jpg', function (err) {
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
