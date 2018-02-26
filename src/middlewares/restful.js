
import path from 'path'
import fs from 'fs-extra'
import _ from 'lodash'
import { Status } from '../config'
import { CODE, ErrorInfo } from '../error'
import logger from '../utils/logger'
import types from '../config/content-type'
import * as imageUtil from '../utils/image'
import { authUser } from './auth'

export default (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization')
  // API
  res.api = (data, code = CODE.ERROR_STATUS_NULL, opts = null) => {
    let status = ErrorInfo(code, opts, true) || null
    logger.info('Restful API %s:', req.method, req.url, JSON.stringify({ data, status }, null, 2))
    return res.json({ data, status })
  }
  // Download
  res.download = async (file, draw) => {
    let extname = path.extname(file)
    let contentType = _.find(types, o => o.suffix.indexOf(extname) > -1)
    let fileStream = fs.readFileSync(file)
    res.setHeader('Content-Type', !_.has(req.query, 'down') && contentType ? contentType.name : 'application/octet-stream')
    if (/\.(gif|png|jpg|jpeg)/.test(extname)) {
      let thumbOpts = req.query.show || req.query.down
      if (thumbOpts) {
        let options = _.zipObject(['width', 'height'], thumbOpts.split(/\|/))
        options.width = _.toInteger(options.width) > 0 ? _.toInteger(options.width) : 150
        options.height = _.toInteger(options.height) > 0 ? _.toInteger(options.height) : 150
        options.draw = draw
        try {
          fileStream = await imageUtil.thumbnail(file, options)
        } catch (error) {
          logger.error(error)
        }
      }
      else if (draw) {
        fileStream = await imageUtil.toBuffer(file)
      }
    }
    return res.send(fileStream)
  }
  // Not Found
  res.notfound = () => res.status(404).render('error', { statusCode: 404, ...Status[404] })
  // Auth
  req.auth = authUser(req)
  return next()
}