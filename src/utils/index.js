
import path from 'path'
import crypto from 'crypto'
import ini from 'ini'
import fs from 'fs-extra'
import isJson from 'is-json'
import _ from 'lodash'

const salt_len = 12
const ran_num = 8
const ran_str = 'abcdefghijkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ@$!%*#?&'

export const loadConfig = (config) => {
  let configInfo = {}
  let configFile = path.resolve(process.cwd(), config)
  try {
    let configStr = fs.readFileSync(configFile, 'utf-8')
    if (isJson(configStr)) {
      configInfo = JSON.parse(configStr)
    }
    else {
      configInfo = ini.parse(configStr)
    }
  } catch (error) {
    
  }
  return configInfo
}

export const loadError = (Code, Message) => {
  let errors = []
  for (let e in Code) {
    errors.push({
      code: Code[e],
      message: Message[e]
    })
  }
  return errors
}

const getAlias = dir => _.upperFirst(dir.match(/[\w\-]+$/)[0].replace(/[\-\_](\w)/g, (x) => x.slice(1).toUpperCase() ))

const getHump = name => name.toLowerCase().replace(/[\-\_](\w)/g, (x) => x.slice(1).toUpperCase() )

export const loadData = (iniFile) => {
  let dataInfo = {}
  let dataFile = path.resolve(process.cwd(), 'data', iniFile)
  try {
    let dataStr = fs.readFileSync(dataFile, 'utf-8')
    if (isJson(dataStr)) {
      dataInfo = JSON.parse(dataStr)
    }
    else {
      dataInfo = ini.parse(dataStr)
    }
  } catch (error) {
    
  }
  return dataInfo
}

export const callback = (resolve, reject, err, doc = null) => {
  if (err) {
    reject(err)
  }
  else {
    resolve(doc)
  }
}

export const random = (len = ran_num, char = ran_str) => {
  let str = ''
  for (let i = 0; i < len; i++) {
    let idx = _.random(0, char.length)
    str += char.slice(idx, idx + 1)
  }
  return str
}

export const md5 = text => crypto.createHash('md5').update(text).digest('hex')
export const sha1 = text => crypto.createHash('sha1').update(text).digest('hex')

const getEncryptPwd = (pwd, salt) => sha1(`${md5(pwd)}^${salt}`)

export const encryptPwd = str => {
  let salt = random(salt_len)
  let encrypt = getEncryptPwd(str, salt)
  return { salt, encrypt }
}

export const validPassword = (pwd, salt, encrypt) => encrypt === getEncryptPwd(pwd, salt)