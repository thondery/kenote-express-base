
import path from 'path'
import { loadConfig } from '../utils'
export { default as Status } from './status'

const kenote = process.env.NODE_ENV === 'production' ? loadConfig('kenote.ini') : {}
const uploadDir = path.resolve(process.cwd(), 'uploadfile')

export const HOST = kenote.HOST || '0.0.0.0'
export const PORT = kenote.PORT || 4000

export const site_name = kenote.site_name || `Kenote`
export const site_url = kenote.site_url || `http://${HOST}:${PORT}`
export const session_secret = kenote.session_secret || 'kenote_secret'

export const logger = {
  category: 'Kenote',
  logPath: path.resolve(process.cwd(), 'logger'),
  logFile: 'access.log',
  maxLogSize: 10 * 1024 * 1024,
  ...kenote.logger
}

export const mongo = {
  uri: 'mongodb://localhost:27017/kenote_express',
  ...kenote.mongo
}

export const redis = {
  host: '127.0.0.1',
  port: 6379,
  ...kenote.redis
}

export const mailer = {
  host: 'smtp.mxhichina.com',
  port: 25,
  auth: {
    user: 'user@mxhichina.com',
    pass: 'password'
  },
  ...kenote.mailer
}

export const group = {
  name: '创建者',
  level: 9999
}

export const store = {
  image: {
    store: 'local',
    root_dir: path.resolve(uploadDir, 'images'),
    mime_type: ['image/png', 'image/jpeg', 'image/gif', 'image/svg'],
    max_size: '5MB',
    draw: true
  },
  files: {
    store: 'local',
    root_dir: path.resolve(uploadDir, 'files'),
    mime_type: [
      'image/png', 
      'image/jpeg', 
      'image/gif', 
      'image/svg',
      'application/octet-stream',
      'application/json',
      'text/markdown',
      'application/zip'
    ],
    max_size: '15MB',
    draw: true
  },
  ...kenote.store
}

/**
 * @param gravity {string}  方位
 * NorthWest -- 左上
 * North     -- 正上
 * NorthEast -- 右上
 * West      -- 正左
 * Center    -- 正中
 * East      -- 正右
 * SouthWest -- 左下
 * South     -- 正下
 * SouthEast -- 右下
 */
export const drawText = {
  color: '#ffffff',
  font: 'Comic Sans MS',
  size: 14,
  text: '@kenote',
  gravity: 'SouthEast',
  ...kenote.drawText
}
