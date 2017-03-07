'use strict'

var schedule = require('node-schedule')

var mongoose = require('mongoose')

var ItemPriceUpdate = mongoose.model('ItemPriceUpdate')
var User = mongoose.model('User')
var moment = require('moment')

var _ = require('lodash')

var nodemailer = require('nodemailer')
var config = require('meanio').getConfig()

var fs = require('fs')

function sendMail (mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function (err, response) {
        if (err) return err
        return response
    })
}

/**
 * offsetType: days, weeks, month,...
 * amount: howMany offsetType to subtract
 */
function priceUpdateSummaryJob(amount, offsetType, subjectType) {
  return function() {
    var pastMoment = moment().subtract(amount, offsetType)

    var updateText = ''

    ItemPriceUpdate.find({
      date: {
          $gt: pastMoment
      }
    })
    .populate('item updatedBy')
    .exec()
    .then(function (result) {
      updateText += '<h1>' + subjectType + ' PriceUpdates in the last ' +  pastMoment.fromNow(true) + ': ' + result.length + '</h1>\n'

      updateText += '<section>'
      var groupedByItem = _.groupBy(result, update => update.item._id)
      _.forEach(groupedByItem, (updatesArray, item) => {
        updateText += '<div>' + updatesArray[0].item.name + ' was updated ' + updatesArray.length + ' times'  + '</div>\n'
      })
      updateText += '</section>'

      updateText += '<section>'
      var groupedByUser = _.groupBy(result, update => { return update.updatedBy ? update.updatedBy._id : 'undefined' })
      _.forEach(groupedByUser, (updatesArray, user) => {
        updateText += '<div>' + (updatesArray[0].updatedBy ? updatesArray[0].updatedBy.name : 'undefined') + ' has done ' + updatesArray.length + ' updates on items'  + '</div>\n'
      })
      updateText += '</section>'
    })
    .then(function () {
      return User.find({name: 'dukfaar'}).exec()
    })
    .then(function (users) {
      _.forEach(users, user => {
        var mailOptions = {
            to: user.email,
            from: config.emailFrom,
            subject: subjectType + 'ItemPriceUpdate Report',
            html: updateText
        }

        sendMail(mailOptions)
      })
    })
    .then(function () {
      fs.writeFile('logs/' + subjectType + '_' + 'itempricesummary_latest' + '.html', updateText)
    })
  }
}

schedule.scheduleJob('0 0 * * *', priceUpdateSummaryJob(1, 'days', 'Daily')) //every day
schedule.scheduleJob('0 0 * * 0', priceUpdateSummaryJob(1, 'weeks', 'Weekly')) //every sunday
schedule.scheduleJob('0 0 1 * *', priceUpdateSummaryJob(1, 'months', 'Monthly')) //every first day of the month
schedule.scheduleJob('0 0 1 1 *', priceUpdateSummaryJob(1, 'years', 'Yearly')) //every first month of a year

module.exports = function () {
  return {
    triggerAllPriceUpdateSummaries: function () {
      priceUpdateSummaryJob(1, 'days', 'Triggered Daily')()
      priceUpdateSummaryJob(1, 'weeks', 'Triggered Weekly')()
      priceUpdateSummaryJob(1, 'months', 'Triggered Monthly')()
      priceUpdateSummaryJob(1, 'years', 'Triggered Yearly')()
    }
  }
}
