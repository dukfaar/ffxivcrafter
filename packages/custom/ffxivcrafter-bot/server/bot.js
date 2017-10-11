'use strict'

var _ = require('lodash')

const Discord = require('discord.js')

var meanio = require('meanio')
var config = meanio.getConfig()

var logger = require('log4js').getLogger('app.bot')

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
  logger.error('discord reports an error: %s', JSON.stringify(error))
})

botDef.bot.on('disconnect', event => {
  logger.info('discord got reconnected')
  logger.info('code: %s', event.code)
  logger.info('reason: %s', event.reason)
})

botDef.bot.on('reconnecting', event => {
  logger.info('reconnecting to discord')
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
    botDef.io.to('discordBot').emit('executed command', {command: commandDef, message: _.pick(message,['content', 'author.id', 'author.username', 'author.discriminator', 'channel.id'])})
    return true
  } else {
    return false
  }
}

botDef.bot.on('message', message => {
  if (message.author.id === botDef.bot.user.id) return {}// nicht auf dich selbst antworten du holzkopf

  botDef.io.to('discordBot').emit('received message', {message: _.pick(message,['content', 'author.id', 'author.username', 'author.discriminator', 'channel.id'])})

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
