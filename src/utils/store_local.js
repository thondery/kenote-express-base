
import path from 'path'
import fs from 'fs-extra'
import moment from 'moment'
import _ from 'lodash'
import { store, site_url } from '../config'
import { md5 } from './index'

const initialize = () => {
  for (let key of _.keys(store)) {
    if (_.has(store[key], 'root_dir')) {
      let rootDir = store[key]['root_dir']
      !fs.existsSync(rootDir) && fs.mkdirpSync(rootDir)
    }
  }
}

initialize()

export const upload = (file, options, callback) => {
  let { filename } = options
  let newFilename = md5(moment().format('x')) + path.extname(filename)
  let uploadStore = store[options.type]
  let filePath = path.resolve(uploadStore.root_dir, newFilename)

  file.on('end', () => 
    callback(null, {
      key: newFilename, 
      url: `${site_url}/uploadfile/${options.type}/${newFilename}`
    })
  )
  file.pipe(fs.createWriteStream(filePath))
}