'use strict'

angular.module('mean.ffxivCrafter_base').factory('EorzeanTimeService', function () {
  var eorzeanTimeConstant = 3600 / 175

  function dateToEorzeanEpoch (date) {
    return date.getTime() * eorzeanTimeConstant
  }

  function getEorzeanEpoch () {
    return dateToEorzeanEpoch(new Date())
  }

  function epochToEorzenTime (epoch) {
    return {
      ms: 0,
      s: parseInt((epoch) % 60),
      m: parseInt((epoch / (60)) % 60),
      h: parseInt((epoch / (60 * 60)) % 24)
    }
  }

  function getEorzeanTime () {
    return epochToEorzenTime(getEorzeanEpoch())
  }

  function timeToNode(time, nodeInfo) {
    var result = {
      h: 0,
      m: 0,
      s: 0,
      realMinutes: 0,
      realSeconds: 0
    }

    if(!nodeInfo) return result

    if(nodeInfo.ampm === 'AM') {
      result.h = nodeInfo.time - time.h
      if(nodeInfo.time <= time.h) {
        result.h += 24
      }
    } else if(nodeInfo.ampm === 'PM') {
      result.h = nodeInfo.time + 12 - time.h
      if((nodeInfo.time + 12) <= time.h) {
        result.h += 24
      }
    } else if(nodeInfo.ampm === 'AM/PM') {
      result.h = nodeInfo.time - (time.h % 12)
      if(nodeInfo.time <= (time.h % 12)) {
        result.h += 12
      }
    }

    if(time.m > 0)
    {
      result.h -= 1
      result.m = 60-time.m
    }

    if(time.s > 0) {
      result.m -= 1
      result.s = 60-time.s
    }

    result.realSeconds = Math.floor((((result.h * 60 + result.m) * 60) + result.s) / eorzeanTimeConstant)
    result.realMinutes = Math.floor(result.realSeconds / 60)
    result.realSeconds -= result.realMinutes * 60

    return result
  }

  return {
    getEorzeanEpoch: getEorzeanEpoch,
    getEorzeanTime: getEorzeanTime,
    eorzeanTimeConstant: eorzeanTimeConstant,
    timeToNode: timeToNode
  }
})
