'use strict'

var mongoose = require('mongoose')

var CraftingProject = mongoose.model('CraftingProject')
var ProjectStockChange = mongoose.model('ProjectStockChange')
var ProjectStep = mongoose.model('ProjectStep')
var Recipe = mongoose.model('Recipe')
var Item = mongoose.model('Item')
var User = mongoose.model('User')

var RestService = require('../services/RestService')()

var nodemailer = require('nodemailer')

var config = require('meanio').getConfig()

var _ = require('lodash')

var Q = require('q')
mongoose.Promise = Q.Promise

module.exports = function (io) {
  var itemService = require('../services/itemService')()

  function updateItem (itemId) {
    return Item.findById(itemId).exec().then(function (item) { return itemService.updateItemAgeMultiplier(item) })
  }

  function stepForItem (itemId, amount, hq) {
    var step = new ProjectStep()

    step.inputs = []

    return Item.findById(itemId)
    .select('availableFromNpc')
    .lean()
    .exec()
    .then(function (item) {
      step.item = item
      step.hq = hq ? hq : false

      return Recipe
        .find({'outputs.item': itemId})
        .lean()
        .exec()
        .then(function (recipes) {
          if (recipes.length === 0) {
            step.step = step.item.availableFromNpc ? 'Buy' : 'Gather'
            step.amount = amount
          } else {
            step.step = step.item.availableFromNpc ? 'Buy' : 'Craft'
            var recipe = recipes[0]
            step.recipe = recipe._id
            step.amount = Math.ceil(amount / recipe.outputs[0].amount) * recipe.outputs[0].amount

            return Q.all(
              _.map(recipe.inputs, function (input) {
                return stepForItem(input.item, input.amount * step.amount / recipe.outputs[0].amount, false)
                .then(function (childStep) {
                  step.inputs.push(childStep)
                })
              })
            )
          }
        })
        .then(function () {
          step.save()
        })
        .then(function () {
          var endTime = new Date().getTime()
          return step
        })
    })
  }

  function projectToMetaProject (project) {
    if (project.tree.step !== 'Meta') {
      var metaStep = new ProjectStep()
      metaStep.item = null
      metaStep.step = 'Meta'
      metaStep.inputs = [project.tree]

      return metaStep.save()
      .then(function () {
        project.tree = metaStep
        return project.save()
      })
    }

    return project
  }

  function populateAndSend (res, projectFind, doPopulate) {
    if (doPopulate) projectFind = projectFind.populate('creator tree stock.item')

    projectFind
      .lean()
      .exec(function (err, result) {
        if (err) throw err

        res.send(result)
      })
  }

  return {
    merge: function (req, res) {
      var project1, project2

      Q.all([
        CraftingProject.findById(req.params.id1).populate('creator tree stock.item').exec().then(function (p) { project1 = p }),
        CraftingProject.findById(req.params.id2).populate('creator tree stock.item').exec().then(function (p) { project2 = p })
      ]).then(function () {
        var metaStep = new ProjectStep()
        metaStep.item = null
        metaStep.step = 'Meta'
        metaStep.inputs = []

        metaStep.inputs.push(project1.tree)
        metaStep.inputs.push(project2.tree)

        return metaStep.save()
      }).then(function (metaStep) {
        var metaProject = new CraftingProject()
        metaProject.name = project1.name + project2.name
        metaProject.creator = req.user ? req.user._id : null
        metaProject.tree = metaStep

        return metaProject.save()
      }).then(function (metaProject) {
        return Q.all([
          project1.remove(),
          project2.remove()
        ])
      }).then(function () {
        res.send('Merged')
      })
    },
    list: function (req, res) {
      var criteria = {}

      var isPM = req.user.roles.indexOf('projectManager') >= 0

      if (isPM) {
        criteria = {
          $or: [
            {private: false},
            {private: true, creator: req.user._id},
            {sharedWith: req.user._id},
            {order: true}
          ]
        }
      } else {
        criteria = {
          $or: [
            {creator: req.user._id},
            {sharedWith: req.user._id}
          ]
        }
      }

      populateAndSend(res, CraftingProject.find(criteria).populate('creator'), req.query.doPopulate === 'true')
    },
    publicList: function (req, res) {
      if (!req.user) {
        res.send([])
      } else {
        var criteria = {}

        var isPM = req.user.roles.indexOf('projectManager') >= 0

        if (isPM) {
          criteria = {
            $or: [
                {public: true, private: false},
                {sharedWith: req.user._id},
                {creator: req.user._id},
                {order: true}
            ]
          }
        } else {
          criteria = {
            $or: [
                {public: true, private: false},
                {sharedWith: req.user._id},
                {creator: req.user._id}
            ]
          }
        }

        populateAndSend(res, CraftingProject.find(criteria), true)
      }
    },
    get: function (req, res) {
      var criteria = { _id: req.params.id }
      criteria.$or = [
        {private: false, public: true},
        {creator: req.user._id},
        {sharedWith: req.user._id}
      ]
      if (req.user.roles.indexOf('projectManager') >= 0) {
        criteria.$or.push({private: false, public: false})
        criteria.$or.push({order: true})
      }

      populateAndSend(res, CraftingProject.findOne(criteria), true)
    },
    addToStock: function (req, res) {
      CraftingProject.findById(req.params.projectId).exec()
      .then(function (project) {
        var stockItem = _.find(project.stock, function (stock) { return stock.item.toString() === req.params.itemId && stock.hq === (req.params.hq === 'true') })

        if (stockItem) {
          stockItem.amount += parseInt(req.params.amount)
          if (stockItem.amount <= 0) project.stock.pull(stockItem)
        } else {
          project.stock.push({item: req.params.itemId, amount: req.params.amount, hq: req.params.hq === 'true'})
        }

        project.save()
        .then(function () {
          io.emit('project stock changed', {
            projectId: project._id,
            item: req.params.itemId,
            amount: req.params.amount,
            hq: req.params.hq === 'true',
            user: req.user
          })
        }).then(function () {
          var stockChange = new ProjectStockChange()
          stockChange.project = req.params.projectId
          stockChange.item = req.params.itemId
          stockChange.hq = req.params.hq
          stockChange.amount = req.params.amount
          stockChange.submitter = req.user._id
          stockChange.dontUseForContribution = req.body.dontUseForContribution
          stockChange.date = new Date()
          return Recipe
           .find({'outputs.item': req.params.itemId })
           .exec()
           .then(function (recipes) {
             if (recipes.length === 0) {
               stockChange.recipe = null
             } else {
               stockChange.recipe = recipes[0]
             }

             return stockChange.save()
           })
        }).then(function () { io.emit('new project stock change', {projectId: project._id}) })
      }).catch(function (err) { throw err })

      res.send({})
    },
    update: function (req, res) {
      CraftingProject.findByIdAndUpdate(req.params.id, req.body).exec()
      .then(function (project) {
        io.emit('project data changed', {projectId: project._id})

        res.send(project)
      }).catch(function (err) { throw err })
    },
    delete: function (req, res) {
      function deleteStep (step) {
        if (step == null) {
          return Q.fcall(function () {})
        } else if (step.inputs.length === 0) {
          return step.remove()
          .then(function () {
            if (step.item) return updateItem(step.item)
          })
        } else {
          return Q.all(step.inputs.map(function (subStep) { return deleteStep(subStep) }))
          .then(function () {
            return step.remove()
          }).then(function () {
            if (step.item) return updateItem(step.item)
          })
        }
      }

      CraftingProject.findById(req.params.id).populate('tree').exec()
      .then(function (project) {
        var deletedProjectName = project.name

        ProjectStockChange.find({project: req.params.id})
        .exec()
        .then(function (changes) {
          changes.forEach(function (change) {
            change.project = null
            change.deletedProjectName = deletedProjectName
            change.save(function (err) {
            })
          })
        })

        deleteStep(project.tree)
        .then(function () {
          return project.remove()
        })
        .then(function () {
          io.emit('project deleted', {projectId: project._id})
        })
      }).catch(function (err) {
        throw err
      })

      res.send('deleting project')
    },
    addToProject: function (req, res) {
      CraftingProject.findById(req.params.projectId)
        .populate('tree')
        .exec()
        .then(function (project) {
          return projectToMetaProject(project)
        })
        .then(function (metaProject) {
          return stepForItem(req.params.id, req.params.amount, req.body.hq)
          .then(function (step) {
            metaProject.tree.inputs.push(step)
            return metaProject.tree.save()
          }).then(function () {
            return metaProject
          })
        })
        .then(function (project) {
          io.emit('project data changed', {projectId: project._id})

          res.send({})
        })
    },
    fromItem: function (req, res) {
      stepForItem(req.params.id, req.params.amount, req.body.hq)
      .then(function (step) {
        var project = new CraftingProject()
        project.creator = req.user._id
        project.tree = step._id

        if (req.body.comment) {
          project.comment = req.body.comment
        }

        if (req.body.orderedViaOrderView) {
          project.order = req.body.orderedViaOrderView
        }

        Item.findById(step.item).exec()
        .then(function (item) {
          project.name = item.name
        })
        .then(function () {
          return project.save()
        })
        .then(function () {
          io.emit('new project created', {projectId: project._id})
          res.send({projectId: project._id})
        })
      })
    }
  }
}
