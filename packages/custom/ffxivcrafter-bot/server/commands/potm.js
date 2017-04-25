'use strict'

let _ = require('lodash')

var mongoose = require('mongoose')
var q = require('q')

module.exports = function (botDef) {
  return {
    name: 'potm',
    command: command
  }

  var UserRank
  var User
  var Rank

  function command (params, message) {
    Rank = Rank || mongoose.model('Rank')
    UserRank = UserRank || mongoose.model('UserRank')
    User = User || mongoose.model('User')

    Rank.findOne({name: 'Potato of the Month'})
    .exec().then((rank) => {
      if (rank) {
        UserRank.find({rank: rank._id})
        .exec().then((userRanks) => {
          if (userRanks.length > 0) {
            if (userRanks.length === 1) {
              User.findById(userRanks[0].user).exec().then(user => {
                message.channel.sendMessage('The current winner of the golden potato is: ' + user.name)
              })
            }
            else {
              var usersPromises = _.map(userRanks, userRank => User.findById(userRank.user).exec())
              q.all(usersPromises)
              .then(users => {
                message.channel.sendMessage('The current winners of the golden potato are: ' + _.join(_.map(users, 'name'), ', '))
              })
            }
          } else {
            message.channel.sendMessage('I could not find a suitable potato. It seems like no one did things that were stupid enough as of late.')
          }
        })
      } else {
        message.channel.sendMessage('Sorry, my master must have made an error with this command. Don\'t burn me')
      }
    })
  }
}
