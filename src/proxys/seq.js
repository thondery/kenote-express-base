// Seq
import { seqDao as Dao } from '../models'
import { callback } from '../utils'

const create = info => {
  return new Promise((resolve, reject) => {
    Dao.create(info, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const findOne = info => {
  return new Promise((resolve, reject) => {
    Dao.one(info, (err, doc) => callback(resolve, reject, err, doc))
  })
}

const updateOneSeq = (query, start = 1) => {
  return new Promise((resolve, reject) => {
    Dao.one(query, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        if (doc) {
          doc.seq = doc.seq < start ? start : doc.seq + 1
          doc.save()
        }
        resolve(doc)
      }
    })
  })
}

const removeAll = () => {
  return new Promise((resolve, reject) => {
    Dao.deleteAll( err => callback(resolve, reject, err))
  })
}

const dropAllIndexes = () => {
  return new Promise((resolve, reject) => {
    Dao.model.collection.dropAllIndexes((err, result) => callback(resolve, reject, err, result))
  })
}

export const clear = () => removeAll().then(dropAllIndexes)

export const addAndUpdateKeys = (model, start = 1) => {
  return findOne({ model })
    .then( ret => {
      if (ret) {
        return updateOneSeq({ model }, start)
      }
      else {
        return create({ model, seq: start })
      }
    })
    .then( ret => ret.seq || 1 )
}

export const updateLastKeys = (model, start) => {
  return new Promise((resolve, reject) => {
    Dao.updateOne({ model }, { seq: start }, (err, doc) => callback(resolve, reject, err, doc))
  })
}