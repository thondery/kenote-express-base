
import path from 'path'
import fs from 'fs-extra'
import log4js from 'log4js'
import { logger } from '../config'

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

export default log4js.getLogger(category)