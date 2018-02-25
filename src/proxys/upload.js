// Upload
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'
import { uploadDao as Dao } from '../models'
import { addAndUpdateKeys, updateLastKeys } from './seq'
import { CODE, ErrorInfo } from '../error'
import { store } from '../config'
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

export const createStore = info => {
  return addAndUpdateKeys('upload')
    .then( ret => create({ ...info, id: ret }))
}

export const updateStore = (_id, info) => {
  return updateOne({ _id }, { ...info, updateAt: new Date() })
}

export const push = info => {
  let { store_type, file_name, file_size } = info
  let uploadStore = store[store_type]
  return findOne({ store_type, file_name })
    .then( ret => {
      if (ret) {
        return uploadStore.store === 'local' && updateStore(ret._id, { file_size })
      }
      else {
        return createStore(info)
      }
      return ret
    })
}

export const updateCounts = (store_type, file_name) => {
  return new Promise((resolve, reject) => {
    Dao.one({ store_type, file_name }, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        if (doc) {
          doc.counts++
          doc.save()
        }
        resolve(doc)
      }
    })
  })
}

export const userTodayCounts = (user, dayString) => {
  let inp = moment(dayString).isValid() ? dayString : undefined
  let [ begin, end ] = [
    moment(inp).utcOffset(8).subtract(1, 'days').format('YYYY-MM-DD'),
    moment(inp).utcOffset(8).format('YYYY-MM-DD')
  ]
  return counts({ user, updateAt: { $gte: `${begin} 00:00:00`, $lt: `${end} 00:00:00` } })
}