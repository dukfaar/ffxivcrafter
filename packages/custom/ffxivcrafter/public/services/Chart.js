'use strict'

angular.module('mean.ffxivCrafter').factory('ChartService', [
  function () {
    return {
       fillDataWithZero: function (data, begin, end, inc) {
        var filled = {}

        for(var cur = begin; cur < end; cur = inc(cur)) {
          filled[cur] = data[cur] ? data[cur] : 0
        }

        return filled
      }
    }
  }
])
