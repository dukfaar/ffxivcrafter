'use strict'

var mongoose = require('mongoose')
var _ = require('lodash')
var q = require('q')

module.exports = function (botDef) {
  return {
    name: 'who is',
    command: command
  }

  var User
  var UserDiscord
  var UserBirthday
  var UserRank
  var Rank

  function command (params, message) {
    User = User || mongoose.model('User')
    UserDiscord = UserDiscord || mongoose.model('UserDiscord')
    UserBirthday = UserBirthday || mongoose.model('UserBirthday')
    UserRank = UserRank || mongoose.model('UserRank')
    Rank = Rank || mongoose.model('Rank')

    let name = _.join(_.slice(params, 2), ' ')

    User.findOne({ $or: [{name: name}, {username: name}] })
    .lean()
    .exec()
    .then(user => {
      if (!user) {
        message.channel.sendMessage('No idea who that could be.')
      } else {
        q.spread([
          UserRank.findOne({user: user._id}).lean().exec()
        ], (userRank) => {
          return [
            UserDiscord.findOne({user: user._id}).lean().exec(),
            UserBirthday.findOne({user: user._id}).lean().exec(),
            userRank?Rank.findById(userRank.rank).lean().exec():q.when(null)
          ]
        })
        .spread((userDiscord, userBirthday, rank) => {
          let lines = []

          if (userDiscord) {
            lines.push('That\'s a ' + user.race + ' who tried to kill me ' + userDiscord.murderAttempts + ' times')
          } else {
            lines.push('That\'s a ' + user.race)
          }

          if(userBirthday) lines.push('Creation date: ' + userBirthday.birthday.toDateString())
          if(rank) lines.push('Rank: ' + rank.name)

          message.channel.sendMessage(lines.join('\n'))
        })
      }
    })
    .catch(err => {
      console.log(err)
      message.channel.sendMessage('I think, some lalafell has sabotaged me.')
    })
  }
}
