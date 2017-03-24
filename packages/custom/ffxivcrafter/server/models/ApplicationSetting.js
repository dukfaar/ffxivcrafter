'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ApplicationSettingSchema = new Schema({
  name: { type: String, unique: true }
}, {strict: false})

mongoose.model('ApplicationSetting', ApplicationSettingSchema)
