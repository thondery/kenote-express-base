// Initialize
import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import ini from 'ini'
import _ from 'lodash'
import { group } from './config'
import { loadData, encryptPwd, validPassword as validPassword2 } from './utils'
import { MASTER_GROUP_NAME, MASTER_GROUP_LEVEL } from './middlewares/auth'
import * as seqProxy from './proxys/seq'
import * as groupProxy from './proxys/group'
import * as userProxy from './proxys/user'

const initialize = async () => {
  let admin = null
  return inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: '系统管理员账号 :',
      default: 'admin',
      validate: validUsername
    },
    {
      type: 'input',
      name: 'password',
      message: '系统管理员密码 :',
      default: 'admin888',
      validate: validPassword
    }
  ])
  .then( ret => {
    admin = ret
    return Promise.all([
      seqProxy.clear(),
      groupProxy.clear(),
      userProxy.clear()
    ])
  })
  .then( ret => {
    return groupProxy.createGroup({
      name: MASTER_GROUP_NAME,
      level: MASTER_GROUP_LEVEL
    })
  })
  .then( ret => {
    return userProxy.createUser({
      ...admin,
      group: ret._id
    })
  })
  .then( ret => {
    console.log(ret)
    process.exit(0)
  })
  .catch( err => {
    console.log(err)
    process.exit(0)
  })
}

const validUsername = value => {
  let val = _.trim(value)
  if (_.isEmpty(val)) {
    return `系统管理员账号不能为空 !`
  }
  if (!/^[a-z]{1}[a-z0-9_]+$/.test(val)) {
    return `系统管理员账号格式错误，因由英语字母、数字和下划线组成，且必须英语字母开头 !`
  }
  if (val.length < 3 || val.length > 20) {
    return `系统管理员账号格式错误，长度因由 3 到 20 个字符组成 !`
  }
  return true
}

const validPassword = value => {
  let val = _.trim(value)
  if (_.isEmpty(val)) {
    return `系统管理员密码不能为空 !`
  }
  if (!/^(?=.*[A-Za-z])[A-Za-z\d$@$!%*#?&]+$/.test(val)) {
    return `系统管理员账号格式错误，因由英语字母、数字和特殊字符组成，且至少一个英语字母 !`
  }
  if (val.length < 6 || val.length > 32) {
    return `系统管理员密码格式错误，长度因由 6 到 32 个字符组成 !`
  }
  return true
}

!module.parent && initialize()
