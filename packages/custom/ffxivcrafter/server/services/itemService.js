'use strict'

var mongoose = require('mongoose')
var Item = mongoose.model('Item')
var ProjectStep = mongoose.model('ProjectStep')
var Q = require('q')

module.exports = function () {
  var updateAgeMultipliersRunning = false
  var lastAgeMultiplierUpdate = null

  function updateItemAgeMultiplier (item) {
    return ProjectStep.find({item: item._id})
    .exec()
    .then(function (steps) {
      item.ageMultiplier = 1.0 + 0.1 * steps.length

      steps.forEach(function(step) {
        item.ageMultiplier += step.amount * 0.01
      })

      return item.save()
    })
  }

  return {
    updateItemAgeMultiplier: updateItemAgeMultiplier,
    updateAllAgeMultipliers: function() {
      var deferred = Q.defer()

      Item.find({})
      .exec(function(err, items) {
        if(err) {
          deferred.reject(err)
        } else {
          Q.all(items.map(function(item) { return updateItemAgeMultiplier(item) }))
          .then(function() {
            deferred.resolve({})
          })
        }
      })

      return deferred.promise
    }
  }
}
