'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

var Schema = mongoose.Schema

var ForumCategorySchema = new Schema({
  name: { type: String, default: 'New Category' },
  parent: { type: Schema.ObjectId, ref: 'ForumCategory' },
  creator: { type: Schema.ObjectId, ref: 'User' },
  created: { type: Date, default: new Date() }
})

function cascadeDeletes(next) {
  mongoose.models.ForumCategory.find({parent: this._id})
  .exec()
  .then(function (categories) {
    _.forEach(categories, function (category) {
      category.remove(function (err, result) {})
    })
  })

  mongoose.models.ForumThread.find({category: this._id})
  .exec()
  .then(function (threads) {
    _.forEach(threads, function (thread) {
      thread.remove(function (err, result) {})
    })
  })

  next()
}

ForumCategorySchema
  .pre('remove', cascadeDeletes)
  .pre('findOneAndRemove', cascadeDeletes)

mongoose.model('ForumCategory', ForumCategorySchema)
