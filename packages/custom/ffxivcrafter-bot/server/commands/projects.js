'use strict'

let _ = require('lodash')

var mongoose = require('mongoose')

module.exports = function (botDef) {
  return {
    name: 'projects',
    command: command
  }

  var CraftingProject

  function command (params, message) {
    CraftingProject = CraftingProject || mongoose.model('CraftingProject')

    CraftingProject.find({public: true, private: false})
    .exec().then((projects) => {
      let resultStr = 'I know about ' + projects.length + ' public ' + (projects.length === 1 ? 'project' : 'projects') + ':\n'

      resultStr += _.join(_.map(projects, project => '* ' + project.name), '\n')

      message.channel.sendMessage(resultStr)
    })
  }
}
