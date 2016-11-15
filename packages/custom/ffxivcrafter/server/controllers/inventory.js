'use strict'

var mongoose = require('mongoose')
var Inventory = mongoose.model('Inventory')
var Recipe = mongoose.model('Recipe')

var Q = require('q')
mongoose.Promise = Q.Promise
var _ = require('lodash')

module.exports = function () {
  function isCraftable (inventory, recipe) {
    return _.every(recipe.inputs, function (input) {
      var invItem = _.find(inventory.items, function (item) {
        return item.item.toString() === input.item._id.toString()
      })
      return invItem && invItem.amount >= input.amount
    })
  }

  function sendCraftables (req, res) {
    Inventory.find({ user: req.user._id }).lean().exec()
    .then(function (inventories) {
      var inventory = inventories[0]

      Recipe.find({}).populate('inputs.item outputs.item').lean()
       .exec()
       .then(function (recipes) {
         res.send(_.filter(recipes, function (recipe) { return isCraftable(inventory, recipe) }))
       })
    })
  }

  return {
    list: function (req, res) {
      if(req.query.craftable) {
        sendCraftables(req, res)
      } else {
        var q = {}

        if(req.query.userInventory) {
          q.user = req.user._id
        }

        Inventory.find(q)
        .lean()
        .exec()
        .then(function (result) {
          res.send(result)
        })
      }
    },
    create: function (req, res) {
      var inventory = new Inventory()

      inventory.save(function (err) {
        if (err) res.status(500).send(err)

        res.json(inventory)
      })
    },
    get: function (req, res) {
      Inventory.findById(req.params.id, function (err, inventory) {
        if (err) res.status(500).send(err)

        res.send(inventory)
      })
    },
    update: function (req, res) {
      Inventory.findByIdAndUpdate(req.params.id, req.body, function (err, inventory) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    },
    delete: function (req, res) {
      Inventory.findByIdAndRemove(req.params.id, function (err) {
        if (err) res.status(500).send(err)

        res.send({})
      })
    }
  }
}
