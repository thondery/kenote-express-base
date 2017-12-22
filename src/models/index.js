const mongoose = require('mongoose')
const MongooseDao = require('mongoosedao')
const Promise = require('bluebird')
const { loadModel } = require('kenote-mount')
const { mongo } = require('../config')
const logger = require('../utils/logger')

const Schema = mongoose.Schema
mongoose.Promise = Promise
mongoose.connect(mongo.uri, {
  useMongoClient: true
}, err => {
  if (err) {
    logger.error(`connect to ${mongo.uri} error: ${err.message}`)
    process.exit(1)
  }
})

function getMongooseDao (definition, name, perfix = mongo.perfix) {
  let schema = definition
  try {
    schema = new Schema(definition)
  } catch (error) {
    
  }
  let model = mongoose.model(`${perfix}${name}`, schema)
  return new MongooseDao(model)
}

const Dao = loadModel(__dirname, getMongooseDao)
Dao.uniqueError = e => e.code === 11000

module.exports = Dao