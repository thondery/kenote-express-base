
import path from 'path'
import fs from 'fs-extra'
import Busboy from 'busboy'
import bytes from 'bytes'
import _ from 'lodash'
import { store, site_url } from '../config'
import { CODE } from '../error'
import storeUtil from '../utils/store'
import * as uploadProxy from '../proxys/upload'

export const upload = (auth, req, res, next) => {
  let fileNum = 1
  let isFileLimit = false
  let notFiles = true
  let upload_type = req.params.type || 'files'
  if (!_.has(store, upload_type)) {
    upload_type = 'files'
  }
  let uploadStore = store[upload_type]
  let busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: bytes(uploadStore.max_size)
    }
  })
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    notFiles = false
    if (fileNum > 1) return
    fileNum++
    let options = {
      filename: filename,
      type: upload_type
    }
    let fileSize = 0
    file.on('data', data => {
      fileSize += data.length
    })
    file.on('limit', () => {
      isFileLimit = true
      res.api(null, CODE.ERROR_UPLOAD_FILESIZE_LARGEMAX, [uploadStore.max_size])
    })
    let storeProxy = storeUtil(uploadStore.store, uploadStore.store_opts)
    storeProxy.upload(file, options, (err, result) => {
      if (err) {
        return next(err)
      }
      if (isFileLimit) {
        uploadStore.store === 'local' && fs.removeSync(result.path)
        return
      }
      let uploadInfo = {
        site_url,
        file_name: result.key,
        file_size: fileSize
      }
      if (uploadStore.store === 'qn') {
        uploadInfo = {
          ...uploadInfo,
          site_url: uploadStore.store_opts.origin,
          url: result.url
        }
      }
      if (uploadStore.store === 'local') {
        uploadInfo = {
          ...uploadInfo,
          url: result.url
        }
      }
      return uploadProxy.push({
        user: auth._id,
        store_type: upload_type, 
        file_name: result.key, 
        file_size: fileSize
      })
      .then( ret => {
        res.api(uploadInfo)
      })
    })
  })
  busboy.on('finish', () => notFiles && res.api(null, CODE.ERROR_UPLOAD_NOT_FILE) )
  req.pipe(busboy)
}

export const dowload = (auth, req, res, next) => {
  let { type, filename } = req.params
  let upload_type = req.params.type
  let filePath = path.resolve(store[upload_type].root_dir, filename)
  if (!fs.existsSync(filePath)) {
    return res.notfound()
  }
  return uploadProxy.updateCounts(upload_type, filename)
    .then( ret => res.download(filePath, store[upload_type].draw) )
    .catch( err => next(err) )
}