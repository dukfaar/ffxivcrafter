'use strict'

var mongoose = require('mongoose')

var CraftingProject = mongoose.model('CraftingProject')
var ProjectStep = mongoose.model('ProjectStep')
var Recipe = mongoose.model('Recipe')
var Item = mongoose.model('Item')
var User = mongoose.model('User')

var nodemailer = require('nodemailer')

var config = require('meanio').loadConfig()

module.exports = function () {
  return {
    list: function (req, res) {
      CraftingProject.find({})
        .populate('creator tree stock.item')
        .lean()
        .exec(function (err, result) {
          if (err) throw err

          res.send(result)
        })
    },
    publicList: function (req, res) {
      CraftingProject.find({public: true})
        .populate('creator tree stock.item')
        .lean()
        .exec(function (err, result) {
          if (err) throw err

          res.send(result)
        })
    },
    addToStock: function (req, res) {
      console.log(req.params.hq)

      CraftingProject.findById(req.params.projectId, function (err, project) {
        if (err) throw err
        var found = false

        project.stock.forEach(function (stock) {
          console.log(stock.hq)
          if (stock.item.toString() === req.params.itemId && stock.hq === (req.params.hq==='true'?true:false)) {
            found = true
            stock.amount += parseInt(req.params.amount)

            if (stock.amount <= 0) {
              project.stock.pull(stock)
              return
            }
          }
        })

        if (!found) {
          project.stock.push({item: req.params.itemId, amount: req.params.amount, hq: (req.params.hq==='true'?true:false)})
        }

        project.save(function (err) {
          if (err) throw err

          res.send({})
        })
      })
    },
    setStock: function (req, res) {
      CraftingProject.findById(req.params.projectId, function (err, project) {
        if (err) throw err
        var found = false

        project.stock.forEach(function (stock) {
          if (stock.item === req.params.itemId && stock.hq === (req.params.hq==='true'?true:false)) {
            found = true
            stock.amount = parseInt(req.params.amount)

            if (stock.amount <= 0) {
              project.stock.pull(stock)
              return
            }
          }
        })

        if (!found) {
          project.stock.push({item: req.params.itemId,amount: req.params.amount, hq: (req.params.hq==='true'?true:false)})
        }

        project.save(function (err) {
          if (err) throw err

          res.send({})
        })
      })
    },
    update: function (req, res) {
      CraftingProject.findByIdAndUpdate(req.params.id, req.body, function (err, project) {
        if (err) throw err

        res.send(project)
      })
    },
    delete: function (req, res) {
      function deleteStep (step, callback) {
        var countdown = step.inputs.length
        if (countdown === 0) {
          step.remove(function (err) {
            if (err) throw err

            callback()
          })
        }

        step.inputs.forEach(function (subStep) {
          deleteStep(subStep, function () {
            countdown--
            if (countdown === 0) {
              step.remove(function (err) {
                if (err) throw err

                callback()
              })
            }
          })
        })
      }

      CraftingProject.findById(req.params.id).populate('tree').exec(function (err, project) {
        if (err) throw err

        deleteStep(project.tree, function () {
          project.remove(function (err) {
            if (err) throw err

            res.send({})
          })
        })
      })
    },
    fromItem: function (req, res) {
      var stepForItem = function (itemId, amount, callback) {
        var step = new ProjectStep()
        step.item = itemId
        step.amount = amount
        step.inputs = []

        Recipe
          .find({'outputs.item': itemId})
          .exec(function (err, recipes) {
            if (err) throw err

            if (recipes.length === 0) {
              step.step = 'Gather'
              step.save(function (err) {
                if (err) throw err

                callback(step)
              })
            } else {
              step.step = 'Craft'
              var recipe = recipes[0]
              step.recipe = recipe._id

              var countdown = recipe.inputs.length

              recipe.inputs.forEach(function (input) {
                stepForItem(input.item, input.amount * amount, function (childStep) {
                  step.inputs.push(childStep)

                  countdown--
                  if (countdown === 0) {
                    step.save(function (err) {
                      if (err) throw err
                      callback(step)
                    })
                  }
                })
              })
            }
          })
      }

      stepForItem(req.params.id, req.params.amount, function (step) {
        var project = new CraftingProject()
        project.creator = req.user._id
        project.tree = step._id

        if (req.body.comment) {
          project.comment = req.body.comment
        }

        project.save(function (err) {
          if (err) throw err

          if(req.body.orderedViaOrderView) {
            User.find({roles: 'projectManager' })
            .exec(function(err,users) {
              if(err) throw err

              var transport = nodemailer.createTransport(config.mailer)

              /*users.forEach(function(user) {
                transport.sendMail({
                  from: config.emailFrom,
                  to: user.email,
                  subject: 'New Crafting order',
                  html: '<p>A new crafting order has been placed by '+req.user.name+'. Please check the RainCollector</p>'
                }, function(err, response) {
                  if (err) return err
                })
              })*/
            })
          }
        })
      })

      res.send({status: 'Working on it'})
    }
  }
}
