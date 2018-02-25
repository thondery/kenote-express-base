
import path from 'path'
import fs from 'fs-extra'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import async from 'async'
import html2text from 'html-to-text'
import nunjucks from 'nunjucks'
import { mjml2html } from 'mjml'
import { mailer, site_name } from '../config'
import logger from './logger'

const mailOpts = smtpTransport(mailer)
const transports = nodemailer.createTransport(mailOpts)
const mailDir = path.resolve(process.cwd(), 'mails')
const mailFrom = `${site_name}服务 <${mailer.auth.user}>`

/** 
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
 **/

export const renderString = (mailFile, options = null) => {
  let extname = path.extname(mailFile)
  let mjmlFile = path.resolve(mailDir, mailFile)
  let tplString = ''
  try {
    let mjnlString = fs.readFileSync(mjmlFile, 'utf-8')
    tplString = /\.(mjml)/.test(extname) ? mjml2html(mjnlString).html : mjnlString
  } catch (error) {
    logger.error(error)
  }
  let htmlString = options ? nunjucks.renderString(tplString, options) : tplString
  return htmlString
}

export const asyncSend = (data) => {
  let options = { times: 5, interval: 200 }
  data = {
    from: mailFrom,
    ...data
  }
  async.retry(options, done => {
    transports.sendMail(data, err => {
      if (err) {
        logger.error('Send Mail Error', err, data) 
      }
      return done()
    })
  }, err => {
    if (err) {
      return logger.error('Send Mail Finally Error', err, data) 
    }
    logger.info('Send Mail Success', data)
  })
}

export const sendMjml = (mjml, data, opts = null) => {
  let html = renderString(mjml, opts)
  let text = html2text.fromString(html)
  asyncSend({ ...data, html, text })
}