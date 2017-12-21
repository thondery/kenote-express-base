
const ini = require('../utils/ini')
const kenoteINI = ini.parse('./kenote.ini')
const hostINI = ini.parse('./scope.ini', 'scope = localhost')
const { scope } = hostINI

module.exports = kenoteINI[process.env.NODE_ENV === 'production' ? scope : 'localhost']