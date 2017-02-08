'use strict'

var mongoose = require('mongoose')
var Recipe = mongoose.model('Recipe')
var Item = mongoose.model('Item')

var httpreq = require('httpreq')

var Q = require('q')
mongoose.Promise = Q.Promise
var _ = require('lodash')

module.exports = function (io) {
  var itemImport = require('../services/itemImport')()
  var xivdbService = require('../services/xivdbService')()

  var populateAndSend = function (findResult, res, req) {
    findResult
      .populate({
        path: 'outputs.item',
        select: 'name'
      })
      .populate({
        path: 'inputs.item',
        select: 'name'
      })
      .lean()
      .exec(function (err, result) {
        if (err) throw err

        res.send(result)
      })
  }

  function setBasicRecipeData (recipe, data) {
    recipe.craftingJob = data.class_name
    recipe.craftingLevel = data.level_view
    recipe.stars = data.stars
    recipe.requiredControl = data.required_control
    recipe.requiredCraftsmanship = data.required_craftsmanship
    recipe.masterbook = Math.floor(data.unlock_key / 10)
  }

  function xivUpdateById (xivItemId, recipe) {
    return xivdbService.getData('http://api.xivdb.com/recipe/' + xivItemId)
    .then(function (data) {
      setBasicRecipeData(recipe, data)

      recipe.outputs = []
      recipe.inputs = []

      return Q.all(
        _.flatten([
          itemImport.findOrCreateItem(data.name_en, data.item.id, false)
          .then(function (item) {
            recipe.outputs.push({item: item._id, amount: data.craft_quantity})
          }),
          _.map(data.tree, function (input) {
            return itemImport.findOrCreateItem(input.name, input.id, false)
            .then(function (item) {
              recipe.inputs.push({item: item._id, amount: input.quantity})
            })
          })
        ])
      ).then(function () {
        return recipe.save()
      })
    })
  }

  function xivImportById (xivItemId) {
    return xivdbService.getData('http://api.xivdb.com/recipe/' + xivItemId)
    .then(function (data) {
      var recipe = new Recipe()
      setBasicRecipeData(recipe, data)

      return Q.all(
        _.flatten([
          itemImport.findOrCreateItem(data.name_en, data.item.id, false)
          .then(function (item) {
            recipe.outputs.push({item: item._id, amount: data.craft_quantity})
          }),
          _.map(data.tree, function (input) {
            return itemImport.findOrCreateItem(input.name, input.id, false)
            .then(function (item) {
              recipe.inputs.push({item: item._id, amount: input.quantity})
            })
          })
        ])
      ).then(function () {
        return recipe.save()
      })
    })
  }

  var RestService = require('../services/RestService')()

  return {
    list: function (req, res) {
      var find = Recipe.find({})

      RestService.list(Recipe.find({}), req)
      .then(function (data) {
        res.send(data)
      })
      .catch(function (err) {
        res.status(500).send({})
      })
    },
    filteredList: function (req, res) {
      Item.find({'name': {$regex: req.params.q, $options: 'i'}}, function (err, result) {
        if (err) throw err

        populateAndSend(Recipe.find({'outputs.item': { $in: result } }), res, req)
      })
    },
    create: function (req, res) {
      var recipe = new Recipe(req.body)

      recipe.save(function (err) {
        if (err) res.send(err)

        res.json(recipe)
      })
    },
    get: function (req, res) {
      Recipe.findById(req.params.id, function (err, recipe) {
        if (err) throw err

        res.send(recipe)
      })
    },
    update: function (req, res) {
      Recipe.findByIdAndUpdate(req.params.id, req.body, function (err, recipe) {
        if (err) throw err

        res.send(recipe)
      })
    },
    delete: function (req, res) {
      Recipe.findByIdAndRemove(req.params.id, function (err) {
        if (err) throw err

        res.send({})
      })
    },
    findByOutput: function (req, res) {
      populateAndSend(Recipe.find({'outputs.item': req.params.id}), res, req)
    },
    fullXivdbImport: function (req, res) {
      xivdbService.getData('http://api.xivdb.com/recipe')
      .then(function (data) {
        var recipesDone = 0
        var newRecipes = 0

        function emitProgress () {
          io.emit('fullXivdbRecipeImport progress', {
            recipesDone: recipesDone,
            newRecipes: newRecipes,
            totalRecipes: data.length
          })
        }

        function checkEmitProgress () {
          if (recipesDone % 10 === 0) {
            emitProgress()
          }
        }

        _.reduce(data, function (promise, recipeData) {
          return promise
          .then(() => {
            return Item.findOne({name: recipeData.name}).exec()
          })
          .then((item) => {
            if(!item) throw new Error('Could not find item for this recipe')
            return Recipe.findOne({'outputs.item': item._id}).exec()
          })
          .then((recipe) => {
            if (!recipe) {
              return xivImportById(recipeData.id)
              .then(function () {
                recipesDone++
                newRecipes++

                checkEmitProgress()
              })
            } else {
              return xivUpdateById(recipeData.id, recipe)
              .then(function () {
                recipesDone++

                checkEmitProgress()
              })
            }
          })
        }, Q.delay(0))
        .then(() => {
          emitProgress()
          io.emit('fullXivdbRecipeImport done', {})
        })
      })
      res.status(200).send('Working on it, this will take a while')
    },
    xivdbImportNoOverwrite: function (req, res) {
      xivdbService.getData('http://api.xivdb.com/recipe')
      .then(function (data) {
        var recipesDone = 0
        var newRecipes = 0

        function emitProgress () {
          io.emit('xivdbRecipeImportNoOverwrite progress', {
            recipesDone: recipesDone,
            newRecipes: newRecipes,
            totalRecipes: data.length
          })
        }

        function checkEmitProgress () {
          if (recipesDone % 10 === 0) {
            emitProgress()
          }
        }

        _.reduce(data, function (promise, recipeData) {
          return promise
          .then(() => {
            return Item.findOne({name: recipeData.name}).exec()
          })
          .then((item) => {
            if(!item) throw new Error('Could not find item for this recipe')
            return Recipe.findOne({'outputs.item': item._id}).exec()
          })
          .then((recipe) => {
            if (!recipe) {
              return xivImportById(recipeData.id)
              .then(function () {
                recipesDone++
                newRecipes++

                checkEmitProgress()
              })
            } else {
              recipesDone++

              checkEmitProgress()
            }
          })
        }, Q.delay(0))
        .then(() => {
          emitProgress()
          io.emit('xivdbRecipeImportNoOverwrite done', {})
        })
      })
      res.status(200).send('Working on it, this will take a while')
    },
    xivdbImport: function (req, res) {
      xivImportById(req.params.id, function (recipe) {
        res.send('Import done')
      })
    }
  }
}
