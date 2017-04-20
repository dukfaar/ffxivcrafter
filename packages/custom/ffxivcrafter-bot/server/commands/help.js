'use strict'

let _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'help',
    command: command
  }

  function command (params, message) {
    let resultStr = 'Here is a list of commands i know about, master didn\'t exactly tell me much about them:\n'
    _.forEach(botDef.commandList, (value, key) => {
      resultStr += '* ' + key + '\n'
    })
    message.channel.sendMessage(resultStr)
  }
}
