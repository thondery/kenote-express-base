
const path = require('path')
const kenote = require('./kenote')

module.exports = {
  // Logger Configure
  logger: {
    category: 'Kenote',
    logPath: path.resolve(process.cwd(), 'logger'),
    logFile: 'access.log',
    maxLogSize: 10 * 1024 * 1024
  },
  ...kenote,
}