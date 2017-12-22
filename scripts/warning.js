const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const ini = require('../src/utils/ini')

const warning = ini.parse('./warning.ini')
const warnDir = path.resolve(process.cwd(), './src/error')
const codeFile = path.resolve(warnDir, 'code.js')
const messageFile = path.resolve(warnDir, 'message.js')

let codeString = `// ------------------------------------
// Error Code
// ------------------------------------`
let msgString = `// ------------------------------------
// Error Message
// ------------------------------------`
for (let e of _.keys(warning)) {
  codeString += `\nexports.ERROR_${e} = ${warning[e].code}`
  msgString += `\nexports.ERROR_${e} = \'${warning[e].name}\'`
}

fs.writeFileSync(codeFile, codeString, 'utf-8')
fs.writeFileSync(messageFile, msgString, 'utf-8')