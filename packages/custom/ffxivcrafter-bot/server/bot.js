'use strict'

var _ = require('lodash')

const Discord = require('discord.js')

var meanio = require('meanio')
var config = meanio.getConfig()

const token = config.discord.token

let botDef = {
  bot: new Discord.Client(),
  commandList: {}
}

var botReaction = require('./botReaction')(botDef)

botDef.bot.on('ready', () => {
  botDef.commandTrigger = '<@' + botDef.bot.user.id + '>'
})

botDef.bot.on('error', error => {
  console.log('DISCORD ERROR: ' + error)
})

botDef.bot.on('disconnect', event => {
  console.log('DISCORD-DISCONNECT: ' + event.code)
  console.log('DISCORD-DISCONNECT: ' + event.reason)
})

botDef.bot.on('reconnecting', event => {
  console.log('DISCORD-RECONNECTING: ' + event)
})

function stubCommand (params, message) {
  message.channel.sendMessage('My glorious master told me that this is something i should answer to.\nBut he forgot to tell me how.')
}

var glob = require('glob')
var path = require('path')

glob.sync(__dirname + '/commands/**/*.js').forEach(function (file) {
  let commandDef = require(path.resolve(file))(botDef)
  botDef.commandList[commandDef.name] = commandDef
})

function processCommand (message) {
  let params = _.split(message.content, ' ')
  let commandDef = _.find(botDef.commandList, c => {
    return _.isRegExp(c.name) ? c.name.test(message) : _.startsWith(message, c.name)
  })
  let commandExec = commandDef ? (commandDef.command ? commandDef.command : stubCommand) : undefined
  if (commandExec) {
    commandExec(params, message)
    return true
  } else {
    return false
  }
}

botDef.bot.on('message', message => {
  if (message.author.id === botDef.bot.user.id) return {}// nicht auf dich selbst antworten du holzkopf

  if (_.includes(message.content, botDef.commandTrigger)) {
    if (message.author.bot) {
      message.channel.sendMessage('I\'m not talking to bots!')
      return {}
    }

    message.content = _.trim(message.content.replace(botDef.commandTrigger, ''))

    if (processCommand(message)) return {}

    message.channel.sendMessage('I don\'t know what you are talking about')
  } else {
    botReaction.process(message)
  }
})

module.exports = function (io) {
  botDef.io = io

  if (token && token.length > 0) {
    botDef.bot.login(token)
  }

  return {

  }
}
