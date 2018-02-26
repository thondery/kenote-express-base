// User
import Promise from 'bluebird'
import uuid from 'node-uuid'
import _ from 'lodash'
import { userDao as Dao } from '../models'
import { addAndUpdateKeys, updateLastKeys } from './seq'
import { CODE, ErrorInfo } from '../error'
import { callback, encryptPwd, validPassword } from '../utils'

const populateStore = [
  {
    path: 'group',
    select: ['_id', 'id', 'name', 'level', 'flag', 'lock', 'list', 'desc', 'upload_type', 'upload_day']
  }
]

const create = info => {
  return new Promise((resolve, reject) => {
    Dao.create(info, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const findOne = (query, populate = null, fields = null) => {
  return new Promise((resolve, reject) => {
    Dao.model.findOne(query)
      .populate(populate || { path: '' })
      .select(fields)
      .exec((err, doc) => callback(resolve, reject, err, doc))
  })
}

const find = (query, populate = null, fields = null, sort = null, limit = 0, skip = 0) => {
  return new Promise((resolve, reject) => {
    Dao.model.find(query)
      .populate(populate || { path: '' })
      .select(fields)
      .sort(sort || { _id: -1 })
      .limit(limit)
      .skip(skip)
      .exec((err, doc) => callback(resolve, reject, err, doc))
  })
}

const counts = (query = null) => {
  return new Promise((resolve, reject) => {
    Dao.count(query, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const updateOne = (query, info) => {
  return new Promise( (resolve, reject) => {
    Dao.updateOne(query, info, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const update = (query, info) => {
  return new Promise( (resolve, reject) => {
    Dao.update(query, info, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const remove = (query) => {
  return new Promise( (resolve, reject) => {
    Dao.delete(query, err => callback(resolve, reject, err))
  })
}

const removeAll = () => {
  return new Promise( (resolve, reject) => {
    Dao.deleteAll( err => callback(resolve, reject, err))
  })
}

const dropAllIndexes = () => {
  return new Promise( (resolve, reject) => {
    Dao.model.collection.dropAllIndexes((err, result) => callback(resolve, reject, err, result))
  })
}

export const clear = () => removeAll().then(dropAllIndexes)

export const createUser = info => {
  let queryInfo = []
  if (info.username) {
    queryInfo.push({ username: info.username })
  }
  if (info.email) {
    queryInfo.push({ email: info.email })
  }
  let password = null
  if (info.password) {
    password = encryptPwd(info.password)
    _.unset(info, 'password')
  }
  return findOne({ $or: queryInfo })
    .then( ret => {
      if (!ret) {
        return addAndUpdateKeys('user')
      }
      if (info.username && ret.username === info.username) {
        throw ErrorInfo(CODE.ERROR_USER_USERNAME_UNIQUE)
      }
      if (info.email && ret.email === info.email) {
        throw ErrorInfo(CODE.ERROR_USER_EMAIL_UNIQUE)
      }
    })
    .then( ret => create({ ...info, ...password, accesskey: uuid.v4(), id: ret }) )
    .then( ret => Promise.promisifyAll(ret).populateAsync(populateStore) )
}

export const accessToken = accesskey => {
  let query = { accesskey: accesskey }
  return findOne(query, populateStore, ['_id', 'id', 'username', 'nickname', 'email', 'accesskey', 'group', 'createAt', 'updateAt'])
    .then( ret => {
      if (!ret) throw ErrorInfo(CODE.ERROR_SIGN_ACCESSTOKEN_NULL)
      return ret
    })
}

export const login = (info) => {
  let { username, password } = info
  let query = {
    $or: [
      { username: username },
      { email: username }
    ]
  }
  return findOne(query, populateStore)
    .then( ret => {
      if (!ret) throw ErrorInfo(CODE.ERROR_LOGINVALID_FAIL)
      let valide = validPassword(password, ret.salt, ret.encrypt)
      if (!valide) throw ErrorInfo(CODE.ERROR_LOGINVALID_FAIL)
      return _.pick(ret, ['_id', 'id', 'username', 'nickname', 'email', 'accesskey', 'group', 'createAt', 'updateAt'])
    })
}
