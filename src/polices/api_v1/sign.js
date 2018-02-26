
import _ from 'lodash'
import { CODE } from '../../error'

export const login = (req, res, next) => {
  let { username, password } = req.body
  username = _.trim(username)
  password = _.trim(password)
  if (_.isEmpty(username)) {
    return res.api(null, CODE.ERROR_LOGINNAME_REQUIRED)
  }
  if (_.isEmpty(password)) {
    return res.api(null, CODE.ERROR_LOGINPASS_REQUIRED)
  }
  return next({
    username: username.replace(/\s+/, ''),
    password: password.replace(/\s+/, '')
  })
}