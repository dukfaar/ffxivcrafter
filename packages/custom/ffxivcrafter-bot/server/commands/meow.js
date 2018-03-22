'use strict'

let httpreq = require('httpreq')

module.exports = function (botDef) {
  return {
    name: 'meow',
    command: command
  }

  function command (params, message) {
    httpreq.get('http://aws.random.cat/meow', (err, result) => {
      if (err) {
        message.channel.sendMessage('Sorry, i don\'t want to catch any cats right now')
      } else {
        let data = JSON.parse(result.body)
        message.channel.sendMessage(data.file)
      }
    })
  }
}
