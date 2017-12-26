
const { userDao } = require('../models')

const create = (info) => {
  return new Promise( (resolve, reject) => {
    userDao.create(info, (err, doc) => {
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
    userDao.model.findOne(query)
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
    userDao.model.find(query)
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
    userDao.count(query, (err, doc) => {
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
    userDao.updateOne(query, info, (err, doc) => {
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
    userDao.update(query, info, (err, doc) => {
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
    userDao.delete(query, err => {
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
    userDao.deleteAll( err => {
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
    userDao.model.collection.dropAllIndexes( (err, result) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(result)
      }
    })
  })
}
  