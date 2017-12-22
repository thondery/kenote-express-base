const _ = require('lodash')
const fs = require('fs-extra')
const path = require('path')
const ini = require('../src/utils/ini')

const appFile = path.resolve(process.cwd(), './src/app.js')
const appString = fs.readFileSync(appFile, 'utf-8')
const routerDir = path.resolve(process.cwd(), './src/routers')
const config = ini.parse('./router.ini')

const routerFilter = appString.split(/\/\/[\s]+/)
const routerString = _.find(routerFilter, o => /Routers/.test(o))
let newRouterString = `Routers\n`
newRouterString += getRouterString()
newRouterString += `\n`
const newAppString = appString.replace(routerString, newRouterString)
//console.log(newAppString)
if (newAppString !== appString) {
  fs.writeFileSync(appFile, newAppString, 'utf-8')
}

function getRouterString () {
  let routers = fs.readdirSync(routerDir)
  routers = _.filter(routers, o => /\.js$/.test(o))
  let _RouterString = ``
  for (let e of routers) {
    let fileName = e.replace(/\.js$/i, '')
    let perfix = fileName.replace(/\_/g, '/')
    let cors = ''
    try {
      if (config[fileName].cors) {
        cors = ' cors(),'
      }
    } catch (error) {
      
    }
    if (perfix === 'default') perfix = '/'
    _RouterString += `app.use(\'${perfix}\',${cors} require(\'./routers/${fileName}\'))\n`
  }
  return _RouterString
}