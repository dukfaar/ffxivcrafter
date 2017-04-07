'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

let schemaDefinition = {
  user: { type: Schema.ObjectId, ref: 'User', unique: true },
  birthday: { type: Date, default: null }
}

var UserBirthdaySchema = new Schema(schemaDefinition)

mongoose.model('UserBirthday', UserBirthdaySchema)
