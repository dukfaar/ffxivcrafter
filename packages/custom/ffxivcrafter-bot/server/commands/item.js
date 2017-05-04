'use strict'

let _ = require('lodash')
var q = require('q')
var mongoose = require('mongoose')
mongoose.Promise = q.Promise

var CraftingController = require('../../../ffxivcrafter/server/controllers/crafting')()

module.exports = function (botDef) {
  var commandRegex = /([iI]tem) ([iI]nfo|[oO]rder|[sS]earch) (.+)/
  return {
    name: commandRegex,
    command: command
  }

  var CraftingProject
  var UserDiscord
  var User
  var Item
  var Recipe
  var ProjectController

  function infoCommand (params, message, regexResult, itemName) {
    var lines = []
    var item =
    Item.findOne({name: itemName})
    .lean().exec()
    .then(i => {
      item = i

      if (item) {
        lines.push(item.name)
        lines.push(`Currently known prices: ${item.price}/${item.priceHQ}`)
        if (item.gatheringJob !== 'None')
          lines.push(`Gathered by: ${item.gatheringJob} at Level ${item.gatheringLevel}`)

        CraftingController.buildCraftingTree(item, 0, (tree) => {
          var materialList = {}

          CraftingController.buildMaterialList(tree, materialList)
          if(tree.inputs.length > 0) {
            var materialPrice = CraftingController.getMaterialPrice(materialList)

            message.channel.sendMessage(`I also found out how to build that thing. The materials would cost about ${materialPrice}gil. (As far as i know about them! No guarantees!)`)
          }
        })
      } else {
        lines.push('Sorry i could not find an item with that name')
      }
    })
    .then(() => {
      message.channel.sendMessage(lines.join('\n'))
    })
    .catch(err => {
      console.log('DISCORD-COMMAND-ERROR: ' + err)
    })
  }

  function searchCommand (params, message, regexResult, itemName) {
    Item.find({name: new RegExp(itemName, 'i')})
    .select('name')
    .lean().exec()
    .then((items) => {
      var lines = []

      lines.push(`I found ${items.length} that would fit your search:`)
      _.forEach(items, i => {
        lines.push(`* ${i.name}`)
      })

      message.channel.sendMessage(_.truncate(lines.join('\n'), {length: 2000, separator: '\n', omission: '\n* ...'}))
    })
    .catch(err => {
      console.log('DISCORD-COMMAND-ERROR: ' + err)
    })
  }

  function orderCommand (params, message, regexResult, itemName) {
    var item
    var project
    var discordUser

    var discordName = message.author.username + '#' + message.author.discriminator

    UserDiscord.findOne({discord: discordName})
    .lean().exec()
    .then(du => {
      if (du) {
        discordUser = du
      } else {
        message.channel.sendMessage('Sorry, but i have no idea who you are. In order for this to work, i need you to tell me that.')
        return q.reject('No DiscordUser')
      }
    })
    .then(() => {
      return Item.findOne({name: itemName})
      .lean().exec()
    })
    .then(i => {
      item = i
      return ProjectController.stepForItem(item._id, 1, false)
    })
    .then(step => {
      project = new CraftingProject()
      project.creator = discordUser.user
      project.tree = step._id
      project.order = true
      project.name = item.name
      return project.save()
    })
    .then(function () {
      botDef.io.emit('new project created', {projectId: project._id})
      message.channel.sendMessage('Your order has been created.')
    })
  }

  function command (params, message) {
    CraftingProject = CraftingProject || mongoose.model('CraftingProject')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    User = User || mongoose.model('User')
    Item = Item || mongoose.model('Item')
    Recipe = Recipe || mongoose.model('Recipe')
    ProjectController = ProjectController || require('../../../ffxivcrafter/server/controllers/project')(botDef.io)

    var regexResult = commandRegex.exec(message)
    var subCommand = regexResult[2]
    var itemName = regexResult[3]

    switch (_.toLower(subCommand)) {
      case 'info':
        infoCommand(params, message, regexResult, itemName)
        break
      case 'search':
        searchCommand(params, message, regexResult, itemName)
        break
      case 'order':
        orderCommand(params, message, regexResult, itemName)
        break
      default:
        message.channel.sendMessage('Something went wrong here....')
        console.log(message)
        break
      }
  }
}
