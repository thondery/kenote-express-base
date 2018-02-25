
import _ from 'lodash'
import util from 'util'
import * as Code from './code'
import * as Message from './message'
import { loadError } from '../utils'

const errors = loadError(Code, Message)

export default errors

export const CODE = Code

export const ErrorInfo = (code, opts = null, json = false) => {
  let info = { code }
  for (let e in Code) {
    if (Code[e] === code) {
      info['message'] = Message[e]
      break
    }
  }
  if (info && _.isArray(opts)) {
    opts.splice(0, 0, info['message'])
    info['message'] = util.format(...opts)
  }
  if (json) return info
  const error = new Error(info.message)
  error.code = info.code
  return error
}

export const CustomError = e => e.code >= 1000