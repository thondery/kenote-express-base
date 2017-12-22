const _ = require('lodash')
const Code = require('./code')
const Message = require('./message')

const errors = []
for (let e in Code) {
  errors.push({
    code: Code[e],
    message: Message[e]
  })
}

exports.default = errors

exports.CODE = Code

exports.ErrorInfo = (code, json = false) => {
  const info = _.find(errors, { code })
  if (json) return info
  const error = new Error(info.message)
  error.code = info.code
  return error
}

exports.CustomError = e => e.code >= 1000