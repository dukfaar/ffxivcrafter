'use strict'

var mongoose = require('mongoose')
var Recipe = mongoose.model('Recipe')
var Item = mongoose.model('Item')

var httpreq = require('httpreq')

module.exports = function () {
  var itemImport = require('../services/itemImport')()

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
      .exec(function (err, result) {
        if (err) throw err

        res.send(result)
      })
  }

  function xivImportById (xivItemId,callback) {
    console.log('Importing Recipe Id' + xivItemId)

    var url = 'http://api.xivdb.com/recipe/' + xivItemId

    httpreq.get(url, function (err, xivdata) {
      if (err) {
        throw err
      } else {
        var data

        try {
          data = JSON.parse(xivdata.body)
        } catch (err) {
          throw err
          return
        }

        var recipe = new Recipe()
        recipe.craftingJob = data.class_name
        recipe.craftingLevel = data.level_view

        function creationDone () {
          recipe.save(function (err) {
            if (err) throw err

            console.log('done Importing Recipe Id' + xivItemId)
            callback(recipe)
          })
        }

        var creationCounter = 1 + data.tree.length
        function decreaseCounter () {
          creationCounter--

          if (creationCounter === 0) creationDone()
        }

        itemImport.findOrCreateItem(data.name_en, data.item.id, function (item) {
          recipe.outputs.push({item: item._id, amount: data.craft_quantity})
          decreaseCounter()
        }, false)

        data.tree.forEach(function (input) {
          itemImport.findOrCreateItem(input.name, input.id, function (item) {
            recipe.inputs.push({item: item._id, amount: input.quantity})
            decreaseCounter()
          }, false)
        })
      }
    })
  }

  return {
    list: function (req, res) {
      populateAndSend(Recipe.find({}), res, req)
    },
    filteredList: function (req, res) {
      Item.find({'name': {$regex: req.params.q, $options: 'i'}}, function (err, result) {
        if (err) throw err

        populateAndSend(Recipe.find({'outputs.item': { $in: result } }), res, req)
      })
    },
    create: function (req, res) {
      var recipe = new Recipe()

      recipe.save(function (err) {
        if (err) res.send(err)

        res.json({text: 'Recipe created'})
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
      var url = 'http://api.xivdb.com/recipe'

      httpreq.get(url, function (err, xivdata) {
        if (err) {
          res.status(500).send('Request failed')
        } else {
          var data

          try {
            data = JSON.parse(xivdata.body)
          } catch (err) {
            res.status(500).send('Failed to parse the xiv data')
            return
          }

          var timeoutCounter = 0

          function checkNextRecipe(index) {
            if(index>=data.length) {
              console.log('finished importing')
              return
            }

            var recipeData=data[index]

            Item.findOne({name: recipeData.name })
              .exec(function (err, item) {
                if (item) {
                  Recipe.findOne({'outputs.item': item}).exec(function (err, recipe) {
                    if (!recipe) {
                      xivImportById(recipeData.id,function(recipe) {
                        setTimeout(function () {
                          checkNextRecipe(index+1)
                        }, 100)
                      })
                    } else {
                      checkNextRecipe(index+1)
                    }
                  })
                } else {
                  checkNextRecipe(index+1)
                }
              })
          }

          checkNextRecipe(0)

          res.status(200).send('Working on it, this will take a while')
        }
      })
    },
    xivdbImport: function (req, res) {
      xivImportById(req.params.id,function(recipe) {
        res.send('Import done')
      })
    }
  }
}
