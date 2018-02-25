
import mongoose from 'mongoose'
import MongooseDao from 'mongoosedao'
import Promise from 'bluebird'
import _ from 'lodash'
import { mongo } from '../config'
import logger from '../utils/logger'

const { Schema } = mongoose
mongoose.Promise = Promise
const version = Number(mongoose.version.match(/(\d+)(\.)(\d+)/)[0])
const options = {
  ...version < 5 ? {
    useMongoClient: true
  } : null
}
mongoose.connect(mongo.uri, options, err => {
  if (err) {
    logger.error(`connect to ${mongo.uri} error: ${err.message}`)
    process.exit(1)
  }
})

const getMongooseDao = (definition, name) => {
  let schema = definition.default || definition
  try {
    schema = new Schema(definition.default || definition)
  } catch (error) {
    
  }
  let model = mongoose.model(name, schema)
  return new MongooseDao(model)
}

//const Dao = loadModel(__dirname, getMongooseDao)
//Dao.uniqueError = e => e.code === 11000

//export default Dao
export const uniqueError = e => e.code === 11000

export const seqDao = getMongooseDao(require('./seq'), 'seq')
export const groupDao = getMongooseDao(require('./group'), 'group')
export const userDao = getMongooseDao(require('./user'), 'user')
export const uploadDao = getMongooseDao(require('./upload'), 'upload')
