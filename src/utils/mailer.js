const mailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const util = require('util')
const path = require('path')
const fs = require('fs-extra')
const async = require('async')
const html2text = require('html-to-text')
const nunjucks = require('nunjucks')
const config = require('../config')
const logger = require('./logger')

const mailOpts = smtpTransport(config.mailer)
const transports = mailer.createTransport(mailOpts)
const mailFrom = util.format('%s <%s>', `${config.site_name}服务`, config.mailer.auth.user)
const templateDir = path.resolve(process.cwd(), 'mails')

/*
 * 发送邮件选项
 * @ from -- 发件人
 *   格式 -- 发件人名称 <发件人邮箱地址>
 * @ to -- 收件人
 *   格式 -- 收件人 <收件人邮箱地址>
 *   多个收件人用逗号分割
 * @ cc -- 抄送，可选项
 *   格式 -- 与收件人相同
 * @ bcc -- 密送，可选项
 *   格式 -- 与收件人相同
 * @ subject -- 标题
 *   格式 -- 字符串
 * @ text -- 正文，文本形式
 *   格式 -- 字符串
 * @ html -- 正文，HTML形式
 *   格式 -- HTML格式
 * @ attachments -- 附件，可选项
 *   格式 -- 数组
 *   [
 *     {
 *       filename: 'README.md',
 *       path: path.resolve(process.cwd(), 'README.md'),
 *       cid: '00000001'
 *     },
 *     {
 *       filename: 'README.md',
 *       content: '发送内容',
 *       cid: '00000002'
 *     }
 *   ]
 */

exports.sendMail = data => {
  let _data = { from: mailFrom, ...data }
  async.retry({ times: 5, interval: 200 }, done => {
    transports.sendMail(_data, err => {
      if (err) {
        logger.error('send mail error', err, _data) 
      }
      return done()
    })
  }, err => {
    if (err) {
      return logger.error('send mail finally error', err, _data) 
    }
    logger.info('send mail success', _data)
  })
}

exports.sendTplMail = (data, tplFile, opts = {}) => {
  let tpl = fs.readFileSync(path.resolve(templateDir, `${tplFile}`), 'utf-8')
  let html = nunjucks.renderString(tpl, opts)
  let text = html2text.fromString(html)
  exports.sendMail({ ...data, text, html})
}

/*
exports.sendTplMail({
  to: 'thondery@163.com',
  subject: '验证码测试',
  attachments: [
    {
      filename: 'README.md',
      path: path.resolve(process.cwd(), 'README.md'),
      cid: '00000001'
    },
    {
      filename: 'test.md',
      content: '发送内容',
      cid: '00000002'
    },
  ]
}, 'captcha.html', { type_name: '登录操作', captcha: 1000 })
*/