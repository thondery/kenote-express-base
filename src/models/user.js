const mongoose = require('mongoose')
const { mongo } = require('../config')

const Schema = mongoose.Schema
const perfix = mongo.perfix

module.exports = {
  id              : { type: Number, default: 0, index: { unique: true } },       // 自动编号
  username        : { type: String },                                            // 用户名
  password        : { type: String },                                            // 密码加密值
  nickname        : { type: String },                                            // 昵称
  email           : { type: String },                                            // 邮箱
  salt            : { type: String },                                            // 密码加密盐
  accesskey       : { type: String },                                            // 安全连接密钥
  createAt        : { type: Date, default: Date.now },                           // 帐号创建时间
  updateAt        : { type: Date, default: Date.now },                           // 帐号更新时间
  retrieveKey     : { type: String },                                            // 用户修改密码的密钥
  retrieveTime    : { type: Number, default: 0 },                                // 用户修改密码的申请时间
  group           : { type: Schema.Types.ObjectId, ref: `${perfix}group` },      // 所属用户组
}