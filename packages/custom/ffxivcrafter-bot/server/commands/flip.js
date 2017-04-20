'use strict'

let _ = require('lodash')

module.exports = function (botDef) {
  return {
    name: 'flip',
    command: command
  }

  function flipText (text) {
    let char = 'abcdefghijklmnopqrstuvwxyz'
    let flipChar = 'ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz'

    return _.map(text, c => {
      let i = char.indexOf(_.lowerCase(c))
      return (i === -1) ? c : flipChar[i]
    })
  }

  function command (params, message) {
    if (params.length > 1 && params[1] !== botDef.commandTrigger) {
      let flipped = _.reverse(flipText(params[1])).join('')
      message.channel.sendMessage('(╯°□°）╯︵' + flipped + '︵' + params[1] + '︵' + flipped)
    } else {
      message.channel.sendMessage('You flipped me? How dare you! I informed my master about that!')
    }
  }
}
