'use strict'

let logLevel = process.env.NODE_ENV === 'development' ? 'TRACE' : 'INFO'

const log4js = require('log4js')
log4js.configure({
  appenders: {
    'default': {
      type: 'dateFile',
      filename: 'logs/app',
      pattern: '-dd.MM.yyyy.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    'default': {
      appenders: ['default'],
      level: logLevel
    }
  }
})

const logger = log4js.getLogger('app.base')
logger.info('LogLevel is set to %s', logLevel)
