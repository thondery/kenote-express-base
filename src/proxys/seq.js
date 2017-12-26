const { seqDao } = require('../models')

exports.addAndUpdateKeys = (modelId, start = 1) => {
  return findOne({ model: modelId })
    .then( ret => {
      if (ret) {
        return updateOneSeq({ model: modelId }, start)
      }
      else {
        return create({ model: modelId, seq: start })
      }
    })
    .then( ret => ret.seq || 1 )
}

exports.updateLastKeys = (modelId, lastSeq) => {
  return new Promise( (resolve, reject) => {
    seqDao.updateOne({ model: modelId }, { seq: lastSeq }, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

exports.removeAll = () => {
  return new Promise( (resolve, reject) => {
    seqDao.deleteAll( err => {
      if (err) {
        reject(err)
      }
      else {
        resolve(null)
      }
    })
  })
}

const create = (info) => {
  return new Promise( (resolve, reject) => {
    seqDao.create(info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const findOne = (info) => {
  return new Promise( (resolve, reject) => {
    seqDao.one(info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const updateOneSeq = (query, start = 1) => {
  return new Promise( (resolve, reject) => {
    seqDao.one(query, (err, doc) => {
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