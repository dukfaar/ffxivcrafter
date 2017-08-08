'use strict'

module.exports = function (botDef) {
  return {
    name: /tea/i,
    command: command
  }

  function teaString () {
    return 'Here is your tea, sire! (づ ￣ ³￣)づ\uD83C\uDF75'
  }

  function command (params, message) {
    message.channel.sendMessage(teaString())
  }
}
