'use strict'

angular.module('mean.ffxivCrafter').factory('ReportingFilterService',
  ['_',
    function (_) {
      var logFilter = {
        numLogItems: 10,
        beginLogItems: 0,
        itemNameFilter: '',
        submitterNameFilter: '',
        projectNameFilter: '',
        ignoreContributionFilter: 'dontCare'
      }

      function logFilterFunction (logItem) {
        var result = true

        if (logItem.item.name && logFilter.itemNameFilter.length > 0) result = result && (logItem.item.name.toLowerCase().search(logFilter.itemNameFilter.toLowerCase()) !== -1)

        result = result && (logItem.submitter.name.toLowerCase().search(logFilter.submitterNameFilter.toLowerCase()) !== -1)

        var projectName = (logItem.project && logItem.project.name) ? logItem.project.name : (logItem.deletedProjectName ? logItem.deletedProjectName : '')

        result = result && (projectName.toLowerCase().search(logFilter.projectNameFilter.toLowerCase()) !== -1)

        switch (logFilter.ignoreContributionFilter) {
          case 'dontCare':
            break
          case 'true':
            result = result && logItem.dontUseForContribution
            break
          case 'false':
            result = result && !logItem.dontUseForContribution
            break
        }

        return result
      }

      function filterLog (log) {
        return _.filter(log, logFilterFunction)
      }

      function nextPage () {
        logFilter.beginLogItems = logFilter.beginLogItems + logFilter.numLogItems
      }

      function prevPage () {
        logFilter.beginLogItems = logFilter.beginLogItems - logFilter.numLogItems
      }

      function isFirstPage () {
        return logFilter.beginLogItems < logFilter.numLogItems
      }

      return {
        logFilter: logFilter,
        logFilterFunction: logFilterFunction,
        filterLog: filterLog,
        nextPage: nextPage,
        prevPage: prevPage,
        isFirstPage: isFirstPage
      }
    }
  ])
