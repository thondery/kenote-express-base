// Group
export default {
  // 自动编号
  id: { 
    type: Number, 
    default: 0, 
    index: { unique: true } 
  },
  // 用户组名
  name: { 
    type: String, 
    required: true 
  },
  // 用户组等级
  level: { 
    type: Number, 
    default: 0 
  },
  // 用户组权限
  flag: { 
    type: Array, 
    default: [] 
  },
  // 用户组锁
  lock: { 
    type: Boolean, 
    default: false 
  },
  // 排序编号
  list: { 
    type: Number, 
    default: 9999 
  },
  // 用户组描述
  desc: { 
    type: String 
  },
  // 上传文件类型
  upload_type: { 
    type: Array, 
    default: [] 
  },
  // 日上传文件数
  upload_day: { 
    type: Number, 
    default: 0 
  },
  // 下载文件类型
  download_type: { 
    type: Array, 
    default: [] 
  }
}