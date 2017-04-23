'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterBot = new Module('ffxivCrafter_bot')
var _ = require('lodash')

const Discord = require('discord.js')

var meanio = require('meanio')
var config = meanio.getConfig()

const token = config.discord.token

let botDef = {
  bot: new Discord.Client(),
  commandList: {},
  wordDetectorList: {}
}

botDef.bot.on('ready', () => {
  botDef.commandTrigger = '<@' + botDef.bot.user.id + '>'
})

function stubCommand (params, message) {
  message.channel.sendMessage('My glorious master told me that this is something i should answer to.\nBut he forgot to tell me how.')
}

var glob = require('glob')
var path = require('path')

glob.sync(__dirname + '/server/commands/**/*.js').forEach(function (file) {
  let commandDef = require(path.resolve(file))(botDef)
  botDef.commandList[commandDef.name] = commandDef
})

glob.sync(__dirname + '/server/wordDetectors/**/*.js').forEach(function (file) {
  let wordDetectorDef = require(path.resolve(file))(botDef)
  botDef.wordDetectorList[wordDetectorDef.name] = wordDetectorDef
})

function processCommand (message) {
  let params = _.split(message.content, ' ')
  let command = params[0]
  let commandDef = botDef.commandList[command]
  let commandExec = commandDef ? (commandDef.command ? commandDef.command : stubCommand) : undefined
  if (commandExec) {
    commandExec(params, message)
    return true
  } else {
    return false
  }
}

function processWordDetector (message) {
  let applicable = []
  _.forEach(botDef.wordDetectorList, d => {
    let value = d.canApply(message)
    if (value !== null) applicable.push(d)
  })

  if (applicable.length === 0) return false

  applicable[0].apply(message)

  return true
}

botDef.bot.on('message', message => {
  if (message.author.id === botDef.bot.user.id) return {}// nicht auf dich selbst antworten du holzkopf

  if (_.includes(message.content, botDef.commandTrigger)) {
    if (message.author.bot) {
      message.channel.sendMessage('I\'m not talking to bots!')
      return {}
    }

    message.content = _.trim(message.content.replace(botDef.commandTrigger, ''))

    if(processCommand(message)) return {}
    if(processWordDetector(message)) return {}

    message.channel.sendMessage('I don\'t know what you are talking about')
  }
})

if (token && token.length > 0) {
  botDef.bot.login(token)
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterBot.register(function (app, ffxivCrafter, ffxivCrafter_gallery) {
  return FFXIVCrafterBot
})
