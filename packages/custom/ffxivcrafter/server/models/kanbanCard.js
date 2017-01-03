'use strict'

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var KanbanCardSchema = new Schema({
  column: { type: Schema.ObjectId, ref: 'KanbanColumn' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  order: { type: Number, default: 0 }
})

mongoose.model('KanbanCard', KanbanCardSchema)
