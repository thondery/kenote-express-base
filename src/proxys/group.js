// Group
import Promise from 'bluebird'
import { groupDao as Dao } from '../models'
import { addAndUpdateKeys, updateLastKeys } from './seq'
import { isMaster } from '../middlewares/auth'
import { CODE, ErrorInfo } from '../error'
import { callback } from '../utils'

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

export const createGroup = info => {
  let start = () => new Promise((resolve, reject) => resolve(0))
  if (isMaster(info.level)) {
    start = () => counts({ level: info.level })
  }
  return start()
    .then( ret => {
      if (ret > 0) {
        throw ErrorInfo(CODE.ERROR_GROUP_MASTER_ONLY)
      }
      return addAndUpdateKeys('group')
    })
    .then( ret => create({ ...info, id: ret }))
}