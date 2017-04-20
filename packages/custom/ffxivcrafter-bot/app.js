'use strict'

/*
 * Defining the Package
 */
var Module = require('meanio').Module

var FFXIVCrafterBot = new Module('ffxivCrafter_bot')
var _ = require('lodash')

const Discord = require('discord.js')
const bot = new Discord.Client()

var meanio = require('meanio')
var config = meanio.getConfig()

var mongoose = require('mongoose')
var CraftingProject = mongoose.model('CraftingProject')

const token = config.discord.token

let commandTrigger

bot.on('ready', () => {
  commandTrigger = '<@' + bot.user.id + '>'
  // console.log('bot is ready')
})

function stubCommand (params, message) {
  message.channel.sendMessage('My glorious master told me that this is something i should answer to.\nBut he forgot to tell me how.')
}

function burnCommand (params, message) {
  if (params.length > 1 && params[1] !== commandTrigger) {
    message.channel.sendMessage('(ﾉ･ｪ･)ﾉ –==≡炎炎炎炎炎炎炎炎' + params[1] + '炎炎炎')
  } else {
    message.channel.sendMessage('You tried burning me? Funny little lalafell...')
  }
}

function flipCommand (params, message) {
  if (params.length > 1 && params[1] !== commandTrigger) {
    message.channel.sendMessage('(╯°□°）╯︵' + params[1])
  } else {
    message.channel.sendMessage('You flipped me? How dare you! I informed my master about that!')
  }
}

function helpCommand (params, message) {
  let resultStr = 'Here is a list of commands i know about, master didn\'t exactly tell me much about them:\n'
  _.forEach(commandList, (value, key) => {
    resultStr += '* ' + key + '\n'
  })
  message.channel.sendMessage(resultStr)
}

function projectsCommand (params, message) {
  CraftingProject.find({public: true, private: false})
  .exec().then((projects) => {
    let resultStr = 'I know about ' + projects.length + ' public ' + (projects.length === 1 ? 'project' : 'projects') + ':\n'

    resultStr += _.join(_.map(projects, project => '* ' + project.name), '\n')

    message.channel.sendMessage(resultStr)
  })
}

let commandList = {
  'flip': flipCommand,
  'meow': stubCommand,
  'help': helpCommand,
  'burn': burnCommand,
  'projects': projectsCommand
}

function processCommand (message) {
  let params = _.split(message.content, ' ')
  let command = params[0]
  let commandExec = commandList[command]
  if (commandExec) commandExec(params, message)
  else message.channel.sendMessage('I don\'t know that command, sorry')
}

bot.on('message', message => {
  if (message.author.id === bot.user.id) return {}// nicht auf dich selbst antworten du holzkopf

  if (_.includes(message.content, commandTrigger)) {
    message.content = _.trim(message.content.replace(commandTrigger, ''))
    processCommand(message)
  }
})

if (token && token.length > 0) {
  bot.login(token)
}

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
FFXIVCrafterBot.register(function (app, ffxivCrafter) {
  return FFXIVCrafterBot
})
