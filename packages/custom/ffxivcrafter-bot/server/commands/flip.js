'use strict'

module.exports = function (botDef) {
  return {
    name: 'flip',
    command: command
  }

  function command (params, message) {
    if (params.length > 1 && params[1] !== botDef.commandTrigger) {
      message.channel.sendMessage('(╯°□°）╯︵' + params[1])
    } else {
      message.channel.sendMessage('You flipped me? How dare you! I informed my master about that!')
    }
  }
}
