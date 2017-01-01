'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var KanbanColumnSchema = new Schema({
  name: { type: String, default: 'New Column' },
  order: { type: Number, default: 0 }
})

mongoose.model('KanbanColumn', KanbanColumnSchema)
