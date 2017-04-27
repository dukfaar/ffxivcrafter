'use strict'

let _ = require('lodash')

var mongoose = require('mongoose')

module.exports = function (botDef) {
  return {
    name: 'my projects',
    command: command
  }

  var CraftingProject
  var UserDiscord
  var User

  function command (params, message) {
    CraftingProject = CraftingProject || mongoose.model('CraftingProject')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    User = User || mongoose.model('User')

    var discordName = message.author.username + '#' + message.author.discriminator

    UserDiscord.findOne({discord: discordName})
    .lean().exec().then((userDiscord) => {
      if (userDiscord) {
        return CraftingProject.find({creator: userDiscord.user})
        .select('name')
        .lean().exec().then((projects) => {
          let resultStr = 'I know about ' + projects.length + (projects.length === 1 ? ' project' : ' projects') + ' you have:\n'

          resultStr += _.join(_.map(projects, project => '* ' + project.name), '\n')

          return resultStr
        })
      } else {
        return 'Sorry, i have no idea who you are.'
      }
    })
    .then(resultStr => {
      message.channel.sendMessage(resultStr)
    })
    .catch(err => {
      console.log('DISCORD-COMMAND-ERROR: ' + err)
    })
  }
}
