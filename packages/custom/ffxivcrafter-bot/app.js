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
  commandList: {}
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

function processCommand (message) {
  let params = _.split(message.content, ' ')
  let command = params[0]
  let commandDef = botDef.commandList[command]
  let commandExec = commandDef ? (commandDef.command ? commandDef.command : stubCommand) : undefined
  if (commandExec) commandExec(params, message)
  else message.channel.sendMessage('I don\'t know that command, sorry')
}

botDef.bot.on('message', message => {
  if (message.author.id === botDef.bot.user.id) return {}// nicht auf dich selbst antworten du holzkopf

  if (message.author.bot) {
    message.channel.sendMessage('I\'m not talking to bots!')
    return {}
  }

  if (_.includes(message.content, botDef.commandTrigger)) {
    message.content = _.trim(message.content.replace(botDef.commandTrigger, ''))
    processCommand(message)
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
