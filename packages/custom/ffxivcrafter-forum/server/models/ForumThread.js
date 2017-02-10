'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

var Schema = mongoose.Schema

var ForumThreadSchema = new Schema({
  title: { type: String, default: 'New Thread' },
  category: { type: Schema.ObjectId, ref: 'ForumCategory' },
  creator: { type: Schema.ObjectId, ref: 'User' },
  created: { type: Date, default: new Date() },
  lastUpdate: { type: Date, default: new Date() }
})

function cascadeDeletes(next) {
  mongoose.models.ForumPost.find({thread: this._id})
  .exec()
  .then(function (posts) {
    _.forEach(posts, function (post) {
      post.remove(function (err, result) {})
    })
  })

  next()
}

ForumThreadSchema
  .pre('remove', cascadeDeletes)
  .pre('findOneAndRemove', cascadeDeletes)

mongoose.model('ForumThread', ForumThreadSchema)
