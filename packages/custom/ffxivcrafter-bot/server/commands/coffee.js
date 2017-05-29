'use strict'

module.exports = function (botDef) {
  return {
    name: /coffee/i,
    command: command
  }

  function coffeeString () {
    return 'Good morning! (づ ￣ ³￣)づ\u2615'
  }

  function command (params, message) {
    message.channel.sendMessage(coffeeString())
  }
}
