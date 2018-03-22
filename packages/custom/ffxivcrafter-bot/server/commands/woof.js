'use strict'

let httpreq = require('httpreq')

module.exports = function (botDef) {
  return {
    name: 'woof',
    command: command
  }

  function command (params, message) {
    httpreq.get('https://random.dog/woof.json', (err, result) => {
      if (err) {
        message.channel.sendMessage('Sorry, i don\'t want to catch any dogs right now')
      } else {
        let data = JSON.parse(result.body)
        message.channel.sendMessage(data.url)
      }
    })
  }
}
