'use strict'

module.exports = function (botDef) {
  return {
    name: 'burn',
    command: command
  }

  function command (params, message) {
    if (params.length > 1 && params[1] !== botDef.commandTrigger) {
      message.channel.sendMessage('(ﾉ･ｪ･)ﾉ –==≡炎炎炎炎炎炎炎炎' + params[1] + '炎炎炎')
    } else {
      message.channel.sendMessage('You tried burning me? Funny little lalafell...')
    }
  }
}
