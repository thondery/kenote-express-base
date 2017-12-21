const ini = require('ini')
const path = require('path')
const fs = require('fs-extra')

exports.parse = (iniString, defaults = ';') => {
  if (!/^(\/|\.{1,2}\/|[A-Za-z]:\\)/.test(iniString)) {
    return ini.parse(iniString)
  }
  let iniFile = /^(\/|[A-Za-z]:\\)/.test(iniString) 
    ? iniString 
    : path.resolve(process.cwd(), iniString)
  let iniStr = defaults
  try {
    iniStr = fs.readFileSync(iniFile, 'utf-8')
  } catch (error) {
    // 
  }
  return ini.parse(iniStr)
}