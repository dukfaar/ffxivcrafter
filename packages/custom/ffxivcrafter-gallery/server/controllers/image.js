
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
    if (query.tags) {
      query.tags = { $regex: new RegExp(query.tags, 'i') }
    }
    return query
  }

  return {
    list: function (req, res) {
      modifyQuery(req.query)

      RestService.listAction(Image, req, res)
    },
    count: function (req, res) {
      modifyQuery(req.query)

      RestService.countAction(Image, req, res)
    },
    create: function (req, res) {
      var form = new formidable.IncomingForm()

      var newImage = new Image()
      newImage.uploader = req.user._id
      newImage.uploadDate = new Date()

      form.on('fileBegin', function (name, file) {
        var splitType = _.split(file.type, '/')
        if (splitType[0] !== 'image') throw new Error('Not an Image')
        newImage.filetype = splitType[1]

        file.path = config.imageStorageBase + '/image_' + newImage._id + '.' + newImage.filetype
      })

      form.on('file', function (name, file) {
        Q.all([
          sharp(file.path)
            .resize(200, 200)
            .max()
            .toFile(config.imageStorageBase + '/image_thumbnail_' + newImage._id + '.' + newImage.filetype)
        ]).then(function () {
          newImage.save()
          .then(() => {
            io.emit('image created', newImage)
          })
        })
        .catch(function (err) {
          res.status(500).send(err)
        })
      })

      form.parse(req, function (err, fields, files) {
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
      Image.findById(req.params.id).exec().then(function (image) {
        fs.readFile(config.imageStorageBase + '/image_' + req.params.id + '.' + (image.filetype ? image.filetype : 'jpg'), function (err, data) {
          if (err) res.status(500).send('')
          else {
            res.setHeader('Content-Type', 'image/' + (image.filetype ? image.filetype : 'jpg'))
            res.send(data)
          }
        })
      })
      .catch(function (error) {
        console.log('Error loading image thumbnail:' + error)
        res.status(500).send('Error while loading image. Sorry!')
      })
    },
    getImageThumbnailData: function (req, res) {
      Image.findById(req.params.id).exec().then(function (image) {
        fs.readFile(config.imageStorageBase + '/image_thumbnail_' + req.params.id + '.' + (image.filetype ? image.filetype : 'jpg'), function (err, data) {
          if (err) res.status(500).send('')
          else {
            res.setHeader('Content-Type', 'image/' + (image.filetype ? image.filetype : 'jpg'))
            res.send(data)
          }
        })
      })
      .catch(function (error) {
        console.log('Error loading image thumbnail:' + error)
        res.status(500).send('Error while loading image. Sorry!')
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
      Image.findById(req.params.id).exec()
      .then(function (image) {
        fs.unlink(config.imageStorageBase + '/image_thumbnail_' + req.params.id + '.' + (image.filetype ? image.filetype : 'jpg'), function (err) {
          if (err) throw new Error(err)
        })

        fs.unlink(config.imageStorageBase + '/image_' + req.params.id + '.' + (image.filetype ? image.filetype : 'jpg'), function (err) {
          if (err) throw new Error(err)
        })

        return Image.findByIdAndRemove(req.params.id).exec()
      })
      .then(function () {
        io.emit('image deleted')
        res.send({})
      })
      .catch(function (err) {
        res.status(500).send(err)
      })
    }
  }
}
