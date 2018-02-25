// Upload
import { Schema } from 'mongoose'
export default {
  // 自动编号
  id: { 
    type: Number, 
    default: 0, 
    index: { unique: true } 
  },
  // 上传类型
  store_type: {
    type: String
  },
  // 文件名称
  file_name: {
    type: String
  },
  // 文件大小
  file_size: {
    type: Number, 
    default: 0
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
  // 下载次数
  counts: {
    type: Number, 
    default: 0
  },
  // 所属用户
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}