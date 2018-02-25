// User
import { Schema } from 'mongoose'
export default {
  // 自动编号
  id: { 
    type: Number, 
    default: 0, 
    index: { unique: true } 
  },
  // 用户名
  username: {
    type: String
  },
  // 昵称
  nickame: {
    type: String
  },
  // 邮箱
  email: {
    type: String
  },
  // 密码加密值
  encrypt: {
    type: String
  },
  // 密码加密盐
  salt: {
    type: String
  },
  // 安全连接密钥
  accesskey: {
    type: String
  },
  // 帐号创建时间
  createAt: {
    type: Date, 
    default: Date.now
  },
  // 帐号更新时间
  updateAt: {
    type: Date, 
    default: Date.now
  },
  // 用户修改密码的密钥
  retrieveKey: {
    type: String
  },
  // 用户修改密码的申请时间
  retrieveTime: {
    type: Number,
    default: 0
  },
  // 所属用户组
  group: {
    type: Schema.Types.ObjectId,
    ref: 'group'
  }
}