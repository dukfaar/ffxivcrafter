'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var KanbanCardSchema = new Schema({
  column: { type: Schema.ObjectId, ref: 'KanbanColumn' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }]
})

mongoose.model('KanbanCard', KanbanCardSchema)
