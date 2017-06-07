'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')

var Schema = mongoose.Schema

let schemaDefinition = {
  user: { type: Schema.ObjectId, ref: 'User', unique: true }
}

let maxLevel = 70
function addClassToDefinition (name) {
  schemaDefinition[name + 'Level'] = { type: Number, min: 0, max: maxLevel, default: 0 }
}

_.forEach([
  'scholar', 'whitemage', 'astrologian',
  'paladin', 'warrior', 'darkknight',
  'ninja', 'monk', 'dragoon',
  'blackmage', 'summoner', 'machinist', 'bard', 'redmage', 'samurai'
], (c) => { addClassToDefinition(c) })


var UserCombatClassesSchema = new Schema(schemaDefinition)

mongoose.model('UserCombatClasses', UserCombatClassesSchema)
