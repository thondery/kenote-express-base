
const { groupDao } = require('../models')

const create = (info) => {
  return new Promise( (resolve, reject) => {
    groupDao.create(info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const findOne = (query, populate = null, fields = null) => {
  return new Promise( (resolve, reject) => {
    groupDao.model.findOne(query)
      .populate(populate)
      .select(fields)
      .exec( (err, doc) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(doc)
        }
      })
  })
}

const find = (query, populate = null, fields = null, sort = null, limit = 0, skip = 0) => {
  return new Promise( (resolve, reject) => {
    groupDao.model.find(query)
      .populate(populate)
      .select(fields)
      .sort(sort || { _id: -1 })
      .limit(limit)
      .skip(skip)
      .exec( (err, doc) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(doc)
        }
      })
  })
}

const counts = (query = null) => {
  return new Promise( (resolve, reject) => {
    groupDao.count(query, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const updateOne = (query, info) => {
  return new Promise( (resolve, reject) => {
    groupDao.updateOne(query, info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const update = (query, info) => {
  return new Promise( (resolve, reject) => {
    groupDao.update(query, info, (err, doc) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(doc)
      }
    })
  })
}

const remove = (query) => {
  return new Promise( (resolve, reject) => {
    groupDao.delete(query, err => {
      if (err) {
        reject(err)
      }
      else {
        resolve(null)
      }
    })
  })
}

const removeAll = () => {
  return new Promise( (resolve, reject) => {
    groupDao.deleteAll( err => {
      if (err) {
        reject(err)
      }
      else {
        resolve(null)
      }
    })
  })
}

const dropAllIndexes = () => {
  return new Promise( (resolve, reject) => {
    groupDao.model.collection.dropAllIndexes( (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
}
  