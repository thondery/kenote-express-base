
import _ from 'lodash'
import * as userProxy from '../../proxys/user'
import { CustomError } from '../../error'

export const login = (data, req, res, next) => {
  return userProxy.login(data)
    .then( ret => {
      let { _id, username, accesskey } = ret
      let user = {
        ..._.pick(ret, ['_id', 'username']),
        token: ret.accesskey
      }
      req.login(user, err => {
        if (err) throw err
        return res.api(ret)
      })
    })
    .catch(CustomError, err =>  res.api(null, err.code) )
    .catch( err => next(err) )
}

export const logout = (req, res, next) => {
  req.logout()
  res.api('以安全登出')
}