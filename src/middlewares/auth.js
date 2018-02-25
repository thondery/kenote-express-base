
import _ from 'lodash'
import moment from 'moment'
import * as userProxy from '../proxys/user'
import * as uploadProxy from '../proxys/upload'
import { CustomError, CODE, ErrorInfo } from '../error'
import { store, site_url } from '../config'

export const MASTER_GROUP_NAME = '创建者'
export const MASTER_GROUP_LEVEL = 9999

export const isMaster = level => level === MASTER_GROUP_LEVEL


export const uploadUser = (req, res, next) => {
  let { authorization } = req.headers
  let upload_tag = req.params.type || 'files'
  let auth = null
  let options = null
  return userProxy.accessToken(authorization)
    .then( ret => {
      let { upload_type, level } = ret.group
      let IsMaster = isMaster(level)
      if (!IsMaster && (upload_type.length === 0 || upload_type.indexOf(upload_tag) === -1)) {
        throw ErrorInfo(CODE.ERROR_UPLOAD_FLAG_NULL)
      }
      auth = ret
      let dayString = moment().subtract(-1, 'days').format('YYYY-MM-DD')
      return uploadProxy.userTodayCounts(ret._id, dayString)
    })
    .then( ret => {
      let { upload_day } = auth.group
      if (!IsMaster && upload_day < ret) {
        options = [upload_day]
        throw ErrorInfo(CODE.ERROR_UPLOAD_DAY_MAXNUM)
      }
      next(auth)
      return null
    })
    .catch( CustomError, err => res.api(null, err.code, options) )
    .catch( err => next(err) )
}

export const downloadUser = (req, res, next) => {
  let { authorization } = req.headers
  let upload_type = req.params.type
  if (!_.has(store, upload_type)) {
    return res.notfound()
  }
  let uploadStore = store[upload_type]
  if (uploadStore.store !== 'local') {
    return res.notfound()
  }
  if (!uploadStore.down_level) {
    return next({})
  }
  return userProxy.accessToken(req.session.token || authorization)
    .then( ret => {
      let { group } = ret
      if (group.level < uploadStore.down_level) {
        throw ErrorInfo(CODE.ERROR_DOWNLOAD_LEVEL_FLAG)
      }
      next(ret)
      return null
    })
    .catch( CustomError, err => res.notfound() )
    .catch( err => next(err) )
}