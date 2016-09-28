'use strict'

var mongoose = require('mongoose')
var ProjectStep = mongoose.model('ProjectStep')

module.exports = function () {
  function recursiveDeleteStep (step, callback) {
    var toGo = step.inputs.length

    var doRemoveAndCallback = function () {
      step.remove(function (err) {
        if (err) throw err

        callback()
      })
    }

    var countdownCallback = function () {
      toGo--

      if (toGo === 0) {
        doRemoveAndCallback()
      }
    }

    if (toGo === 0) doRemoveAndCallback()

    step.inputs.forEach(function (subStep) {
      recursiveDeleteStep(subStep, countdownCallback)
    })
  }

  return {
    list: function (req, res) {
      ProjectStep.find({})
        .exec(function (err, result) {
          if (err) throw err

          res.send(result)
        })
    },
    create: function (req, res) {
      var step = new ProjectStep()
      console.log(req)

      step.save(function (err) {
        if (err) res.send(err)

        res.json({text: 'ProjectStep created'})
      })
    },
    get: function (req, res) {
      ProjectStep.findById(req.params.id)
        .lean()
        .exec(function (err, step) {
          if (err) throw err

          res.send(step)
        })
    },
    update: function (req, res) {
      ProjectStep.findByIdAndUpdate(req.params.id, req.body, function (err, step) {
        if (err) throw err

        res.send(step)
      })
    },
    delete: function (req, res) {
      ProjectStep.findById(req.params.id, function (err, step) {
        if (err) throw err

        recursiveDeleteStep(step,function() {
          ProjectStep.find({'inputs':req.params.id})
          .exec(function(err,steps) {
            if(err) throw error

            CraftingProject.find({'tree':req.params.id})
            .exec(function(err,project) {
              if(err) throw err

              project.tree=null
              project.save(function(err) {
                if(err) throw err

                res.send({})
              })
            })
          })
        })
      })
    }
  }
}
