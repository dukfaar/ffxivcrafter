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
  function stepForItem (itemId, amount, callback) {
    var step = new ProjectStep()
    step.item = itemId
    step.inputs = []

    Recipe
      .find({'outputs.item': itemId})
      .exec(function (err, recipes) {
        if (err) throw err

        if (recipes.length === 0) {
          step.step = 'Gather'
          step.amount = amount

          step.save(function (err) {
            if (err) throw err

            callback(step)
          })
        } else {
          step.step = 'Craft'
          var recipe = recipes[0]
          step.recipe = recipe._id

          var countdown = recipe.inputs.length

          amount = Math.ceil(amount / recipe.outputs[0].amount) * recipe.outputs[0].amount
          step.amount = amount

          recipe.inputs.forEach(function (input) {
            stepForItem(input.item, input.amount * amount / recipe.outputs[0].amount, function (childStep) {
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

  function projectToMetaProject (project, callback) {
    if (project.tree.step !== 'Meta') {
      var metaStep = new ProjectStep()
      metaStep.item = null
      metaStep.step = 'Meta'
      metaStep.inputs = [project.tree]

      metaStep.save(function (err) {
        if (err) throw err

        project.tree = metaStep
        project.save(function (err) {
          if (err) throw err
          callback(project)
        })
      })
    } else {
      callback(project)
    }
  }

  return {
    merge: function (req, res) {
      CraftingProject.findById(req.params.id1)
        .populate('creator tree stock.item')
        .exec(function (err, project1) {
          CraftingProject.findById(req.params.id2)
            .populate('creator tree stock.item')
            .exec(function (err, project2) {
              console.log('trying to merge')

              var metaStep = new ProjectStep()
              metaStep.item = null
              metaStep.step = 'Meta'
              metaStep.inputs = []

              metaStep.inputs.push(project1.tree)
              metaStep.inputs.push(project2.tree)

              metaStep.save(function (err) {
                if (err) throw err

                var metaProject = new CraftingProject()
                metaProject.name = project1.name + project2.name
                metaProject.creator = req.user ? req.user._id : null
                metaProject.tree = metaStep

                metaProject.save(function (err) {
                  if (err) throw err
                  project1.remove(function (err) {
                    if (err) throw err
                    project2.remove(function (err) {
                      if (err) throw err
                      res.send('Merged')
                    })
                  })
                })
              })
            })
        })
    },
    list: function (req, res) {
      CraftingProject.find({
        $or: [
          {private: false},
          {private: true, creator: req.user._id}
        ]
      })
        .populate('creator tree stock.item')
        .lean()
        .exec(function (err, result) {
          if (err) throw err

          res.send(result)
        })
    },
    publicList: function (req, res) {
      CraftingProject.find({public: true, private: false})
        .populate('creator tree stock.item')
        .lean()
        .exec(function (err, result) {
          if (err) throw err

          res.send(result)
        })
    },
    addToStock: function (req, res) {
      CraftingProject.findById(req.params.projectId, function (err, project) {
        if (err) throw err
        var found = false

        project.stock.forEach(function (stock) {
          if (stock.item.toString() === req.params.itemId && stock.hq === (req.params.hq === 'true' ? true : false)) {
            found = true
            stock.amount += parseInt(req.params.amount)

            if (stock.amount <= 0) {
              project.stock.pull(stock)
              return
            }
          }
        })

        if (!found) {
          project.stock.push({item: req.params.itemId, amount: req.params.amount, hq: (req.params.hq === 'true' ? true : false)})
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
          if (stock.item === req.params.itemId && stock.hq === (req.params.hq === 'true' ? true : false)) {
            found = true
            stock.amount = parseInt(req.params.amount)

            if (stock.amount <= 0) {
              project.stock.pull(stock)
              return
            }
          }
        })

        if (!found) {
          project.stock.push({item: req.params.itemId,amount: req.params.amount, hq: (req.params.hq === 'true' ? true : false)})
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
    updateNotes: function (req, res) {
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
    addToProject: function (req, res) {
      CraftingProject.findById(req.params.projectId)
        .populate('creator tree stock.item')
        .exec(function (err, project) {
          projectToMetaProject(project, function (metaProject) {
            stepForItem(req.params.id, req.params.amount, function (step) {
              metaProject.tree.inputs.push(step)
              metaProject.tree.save(function (err) {
                if (err) throw err

                res.send(metaProject)
              })
            })
          })
        })
    },
    fromItem: function (req, res) {
      stepForItem(req.params.id, req.params.amount, function (step) {
        var project = new CraftingProject()
        project.creator = req.user._id
        project.tree = step._id

        Item.findById(step.item, function (err, item) {
          project.name = item.name

          if (req.body.comment) {
            project.comment = req.body.comment
          }

          project.save(function (err) {
            if (err) throw err

            if (req.body.orderedViaOrderView) {
              User.find({roles: 'projectManager' })
                .exec(function (err, users) {
                  if (err) throw err

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
      })

      res.send({status: 'Working on it'})
    }
  }
}
