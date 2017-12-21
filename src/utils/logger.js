const path = require('path')
const fs = require('fs-extra')
const log4js = require('log4js')
const { logger } = require('../config')
const { logPath, logFile, maxLogSize, category } = logger

!fs.existsSync(logPath) && fs.mkdirpSync(logPath)

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: path.resolve(logPath, logFile),
      maxLogSize: maxLogSize,
      numBackups: 5,
      compress: true,
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+',
      pattern: 'yyyy-MM-dd-hh'
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: { appenders: ['file', 'out'], level: 'trace' }
  }
})

module.exports = log4js.getLogger(category)